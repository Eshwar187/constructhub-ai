'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PaintingRecommendations from '@/components/floor-plan/PaintingRecommendations';
import { toast } from 'sonner';

interface Project {
  _id: string;
  name: string;
  description: string;
  landArea: number;
  landUnit: string;
  budget: number;
  currency: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  floorPlan?: string;
  floorPlanDescription?: string;
  suggestions?: {
    materials: Array<{
      name: string;
      cost: number;
      description: string;
    }>;
    professionals: Array<{
      name: string;
      profession: string;
      contact: string;
      rating: number;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage({ params }: { params: { id: string } }): React.ReactElement {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [paintingRecommendations, setPaintingRecommendations] = useState(null);
  const [floorPlanPrompt, setFloorPlanPrompt] = useState('');
  const [isGeneratingFloorPlan, setIsGeneratingFloorPlan] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          toast.error('Failed to fetch project details');
        }
      } catch (error) {
        toast.error('An error occurred while fetching project details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const generateFloorPlan = async () => {
    if (!floorPlanPrompt) {
      toast.error('Please enter a description for the floor plan');
      return;
    }

    setIsGeneratingFloorPlan(true);
    // Use Sonner toast with promise to handle loading state
    toast.promise(
      // This is the promise we're tracking
      new Promise(async (resolve, reject) => {
        try {
          console.log('Generating floor plan with prompt:', floorPlanPrompt);

          const response = await fetch('/api/ai/generate-floor-plan', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              projectId: params.id,
              prompt: floorPlanPrompt,
            }),
          });

          const data = await response.json();
          console.log('Floor plan generation response:', data);

          if (response.ok) {
            // Check if we have painting recommendations
            if (data.paintingRecommendations) {
              setPaintingRecommendations(data.paintingRecommendations);
            }

            // Fetch the updated project to get both the floor plan and description
            const updatedResponse = await fetch(`/api/projects/${params.id}`);
            const updatedProject = await updatedResponse.json();

            if (updatedResponse.ok) {
              setProject(updatedProject);

              // Close the dialog by simulating a click on the cancel button
              const cancelButton = document.querySelector('button[aria-label="Close"]');
              if (cancelButton instanceof HTMLElement) {
                cancelButton.click();
              }
              resolve(data.paintingRecommendations ? 'Floor plan and painting recommendations generated!' : 'Success');
            } else {
              // If we can't fetch the updated project, at least update the floor plan
              setProject(prev => prev ? { ...prev, floorPlan: data.floorPlan } : null);
              resolve(data.paintingRecommendations ? 'Floor plan and painting recommendations generated with partial update!' : 'Success with partial update');
            }
          } else {
            console.error('Failed to generate floor plan:', data);
            reject(data.error || 'Failed to generate floor plan. Please try again.');
          }
        } catch (error) {
          console.error('Error generating floor plan:', error);
          reject('An error occurred while generating the floor plan. Please try again.');
        } finally {
          setIsGeneratingFloorPlan(false);
        }
      }),
      {
        loading: 'Generating AI floor plan... This may take up to 2-3 minutes.',
        success: (message) => message || 'Floor plan generated successfully!',
        error: (err) => `${err}`
      }
    );

    // The floor plan generation is now handled in the promise above
  };

  const getSuggestions = async () => {
    setIsLoadingSuggestions(true);

    try {
      const response = await fetch(`/api/suggestions?projectId=${params.id}`);

      if (response.ok) {
        const data = await response.json();
        setProject(prev => prev ? {
          ...prev,
          suggestions: {
            materials: data.materials,
            professionals: data.professionals,
          }
        } : null);
        toast.success('Suggestions loaded successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to load suggestions');
      }
    } catch (error) {
      toast.error('An error occurred while loading suggestions');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const deleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      // Show a toast notification
      toast('Deleting project...');

      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Project deleted successfully');
        // Force a delay before navigation to ensure the toast is shown
        setTimeout(() => {
          router.push('/projects');
        }, 500);
      } else {
        const data = await response.json();
        console.error('Failed to delete project:', data);
        toast.error(data.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('An error occurred while deleting the project');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <p className="text-gray-400 mb-6">The project you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button
          onClick={() => router.push('/projects')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Return to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-1">Created on {new Date(project.createdAt).toLocaleDateString()}</p>
        </div>
        <Button
          variant="destructive"
          onClick={deleteProject}
          className="bg-red-600 hover:bg-red-700"
        >
          Delete Project
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="floor-plan">Floor Plan</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Basic information about your construction project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Description</h3>
                    <p className="text-gray-300">{project.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Land Area</h3>
                      <p className="text-gray-300">
                        {project.landArea.toLocaleString()} {project.landUnit}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Budget</h3>
                      <p className="text-gray-300">
                        {project.currency} {project.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Country</p>
                      <p className="text-gray-300">{project.location.country}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">State/Province</p>
                      <p className="text-gray-300">{project.location.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">City</p>
                      <p className="text-gray-300">{project.location.city}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="floor-plan" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Floor Plan</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Generate and view AI-powered floor plans for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {project.floorPlan ? (
                  <div className="space-y-6">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative border border-gray-700 rounded-lg overflow-hidden bg-white p-2 transition-all duration-300 shadow-lg shadow-blue-900/10 group-hover:shadow-blue-900/30">
                        <div className="absolute top-3 right-3 z-10 flex space-x-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full bg-gray-800/80 border-gray-700 hover:bg-gray-700 text-white"
                            onClick={() => {
                              // Handle data URLs properly
                              if (project.floorPlan?.startsWith('data:')) {
                                try {
                                  // Create a temporary link element
                                  const link = document.createElement('a');
                                  link.href = project.floorPlan;
                                  link.target = '_blank';
                                  link.rel = 'noopener noreferrer';

                                  // Append to the document, click it, and remove it
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                } catch (error) {
                                  console.error('Error opening image in new tab:', error);
                                  toast.error('Error opening image in new tab');
                                }
                              } else if (project.floorPlan) {
                                // For regular URLs, just open in a new tab
                                window.open(project.floorPlan, '_blank');
                              }
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full bg-gray-800/80 border-gray-700 hover:bg-gray-700 text-white"
                            onClick={() => {
                              // Create a download link for the image
                              const link = document.createElement('a');
                              link.href = project.floorPlan || '';
                              link.download = `floor-plan-${project._id}.png`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                          </Button>
                        </div>
                        <img
                          src={project.floorPlan}
                          alt="Floor Plan"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>

                    {project.floorPlanDescription && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-blue-400">Blueprint Description</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              const element = document.createElement('a');
                              const file = new Blob([project.floorPlanDescription || ''], {type: 'text/plain'});
                              element.href = URL.createObjectURL(file);
                              element.download = `floor-plan-description-${project._id}.txt`;
                              document.body.appendChild(element);
                              element.click();
                              document.body.removeChild(element);
                            }}
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            Download
                          </Button>
                        </div>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-300 max-h-[200px] overflow-y-auto">
                          {project.floorPlanDescription}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-800/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                          </svg>
                          <span className="text-blue-400 font-medium">Land Area:</span>
                          <span className="text-white">{project.landArea.toLocaleString()} {project.landUnit}</span>
                        </div>
                        <p className="text-gray-400 text-sm">This blueprint is optimized for your specified land area and requirements.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-gradient-to-r from-blue-900/80 to-purple-900/80 text-blue-300 px-3 py-1.5 rounded-full font-medium text-sm border border-blue-800/50 shadow-inner shadow-blue-900/20">Professional Blueprint</span>
                        {project.floorPlan && (project.floorPlan.startsWith('data:') || project.floorPlan.startsWith('http')) ? (
                          <Button variant="outline" className="border-gray-700 hover:bg-gray-700/50 hover:text-white transition-all duration-300" onClick={() => window.open(project.floorPlan, '_blank')}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                          </Button>
                        ) : (
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2" onClick={() => {
                            // Create a text file and download it
                            const element = document.createElement('a');
                            const file = new Blob([project.floorPlan || ''], {type: 'text/plain'});
                            element.href = URL.createObjectURL(file);
                            element.download = `floor-plan-${project._id}.txt`;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                            </svg>
                            <span>Download Instructions</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Display painting recommendations if available */}
                    <PaintingRecommendations recommendations={paintingRecommendations} />

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40 hover:scale-105 relative overflow-hidden group">
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse-slow"></span>
                          <span className="absolute -inset-x-2 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"></span>
                          <span className="relative flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Generate AI Floor Plan
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800/95 border-gray-700 text-white backdrop-blur-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5"></div>
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px] opacity-30"></div>

                        <motion.div
                          className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.3, 0.1],
                          }}
                          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />

                        <div className="relative z-10">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient-text">Generate AI Floor Plan</DialogTitle>
                            <p className="text-gray-400 mt-2">Describe your floor plan requirements and our AI will generate a professional blueprint image for you</p>
                          </DialogHeader>

                          <div className="space-y-4 py-6">
                            <div className="space-y-2">
                              <Label htmlFor="prompt-dialog" className="text-blue-300 font-medium">Describe your floor plan requirements in detail</Label>
                              <Textarea
                                id="prompt-dialog"
                                placeholder="e.g., Modern 3-bedroom house with 2 bathrooms, open kitchen connected to living room, home office, large windows for natural light, double garage, and a covered patio. Include specific dimensions, layout preferences, and any special features you want in your floor plan."
                                value={floorPlanPrompt}
                                onChange={(e) => setFloorPlanPrompt(e.target.value)}
                                className="bg-gray-700/70 border-gray-600 text-white min-h-[120px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                              />
                              <p className="text-xs text-gray-400 mt-1">The more details you provide, the better the blueprint instructions will be.</p>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span>This will replace your current blueprint with a new one</span>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3">
                            <DialogTrigger asChild>
                              <Button variant="outline" className="border-gray-700 hover:bg-gray-700/50 hover:text-white transition-all duration-300">
                                Cancel
                              </Button>
                            </DialogTrigger>
                            <Button
                              onClick={generateFloorPlan}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40 hover:scale-105 relative overflow-hidden group"
                              disabled={isGeneratingFloorPlan || !floorPlanPrompt}
                            >
                              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse-slow"></span>
                              <span className="absolute -inset-x-2 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"></span>

                              {isGeneratingFloorPlan ? (
                                <>
                                  <span className="relative flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating AI Floor Plan (2-3 mins)...
                                  </span>
                                  <div className="absolute bottom-full left-0 right-0 mb-2 text-xs text-center text-blue-300 bg-blue-900/50 py-1 px-2 rounded">
                                    Please wait while DALL-E generates your floor plan based on Groq's description...
                                  </div>
                                </>
                              ) : (
                                <span className="relative flex items-center">
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                  </svg>
                                  Generate AI Floor Plan
                                </span>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="border border-gray-700 rounded-lg p-8 text-center bg-gray-800/50 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-900/20">
                      {/* Background elements */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px] opacity-0 group-hover:opacity-30 transition-all duration-500"></div>

                      {/* Animated elements */}
                      <motion.div
                        className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      />

                      <div className="relative z-10">
                        <div className="mb-6">
                          <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-slow"></div>
                            <div className="relative bg-gray-800/80 rounded-full p-5 border border-gray-700 group-hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm">
                              <svg className="w-14 h-14 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                              </svg>
                            </div>
                          </div>
                          <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient-text drop-shadow-sm">
                            Create Your Blueprint
                          </h3>
                          <p className="text-gray-400 mb-6 max-w-md mx-auto group-hover:text-gray-300 transition-colors duration-300">
                            Generate a professional architectural blueprint based on your project's land area of <span className="text-blue-400 font-semibold">{project.landArea} {project.landUnit}</span>.
                          </p>
                        </div>

                        <div className="space-y-4 max-w-lg mx-auto">
                          <Label htmlFor="prompt" className="text-left block text-gray-300 group-hover:text-white transition-colors duration-300">
                            Describe your floor plan requirements
                          </Label>
                          <Textarea
                            id="prompt"
                            placeholder="e.g., Modern 3-bedroom house with 2 bathrooms, open kitchen connected to living room, home office, large windows for natural light, double garage, and a covered patio."
                            value={floorPlanPrompt}
                            onChange={(e) => setFloorPlanPrompt(e.target.value)}
                            className="bg-gray-700/70 border-gray-600 text-white min-h-[120px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />

                          <div className="pt-4">
                            <Button
                              onClick={generateFloorPlan}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40 hover:scale-[1.02] py-6 relative overflow-hidden group"
                              disabled={isGeneratingFloorPlan || !floorPlanPrompt}
                            >
                              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse-slow"></span>
                              <span className="absolute -inset-x-2 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70"></span>

                              {isGeneratingFloorPlan ? (
                                <span className="relative flex items-center justify-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span className="text-lg">Generating Blueprint...</span>
                                </span>
                              ) : (
                                <span className="relative flex items-center justify-center">
                                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                  </svg>
                                  <span className="text-lg">Generate Blueprint</span>
                                </span>
                              )}
                            </Button>
                          </div>

                          <p className="text-xs text-gray-500 mt-4 italic">
                            The AI will generate a professional architectural blueprint based on your requirements and the land area of your project.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Get real-time suggestions for materials based on your project details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {project.suggestions ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-medium mb-4">Recommended Materials</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.suggestions.materials.map((material, index) => (
                          <Card key={index} className="bg-gray-750 border-gray-700">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{material.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-300 mb-2">{material.description}</p>
                              <p className="text-blue-400 font-medium">
                                Estimated Cost: {project.currency} {material.cost.toLocaleString()}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Local Professionals section removed as requested */}

                    <Button
                      onClick={getSuggestions}
                      disabled={isLoadingSuggestions}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40"
                    >
                      <span className="flex items-center">
                        {/* Add content here if needed */}
                      </span>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-24 h-24 mx-auto mb-4 bg-green-900/20 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                      </svg>
                    </div>
                    <p className="text-gray-400 mb-2">
                      No material suggestions available yet.
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                      Get real-time suggestions for materials based on your project details and budget.
                    </p>
                    <Button
                      onClick={getSuggestions}
                      disabled={isLoadingSuggestions}
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40 w-full"
                    >
                      {isLoadingSuggestions ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading Suggestions...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                          Get Material Suggestions
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
