'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

interface Project {
  _id: string;
  name: string;
  description: string;
  userId: string;
  landArea: number;
  landUnit: string;
  budget: number;
  currency: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  createdAt: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          toast.error('Failed to fetch projects');
        }
      } catch (error) {
        toast.error('An error occurred while fetching projects');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProjects(projects.filter(project => project._id !== projectId));
        toast.success('Project deleted successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete project');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the project');
    } finally {
      setIsDeleting(false);
    }
  };

  // Mock data for demonstration
  const mockProjects: Project[] = [
    {
      _id: '1',
      name: 'Modern House Project',
      description: 'A modern house with 3 bedrooms and 2 bathrooms',
      userId: 'user_1',
      landArea: 2500,
      landUnit: 'Square Feet',
      budget: 250000,
      currency: 'USD',
      location: {
        country: 'United States',
        state: 'California',
        city: 'Los Angeles',
      },
      createdAt: new Date().toISOString(),
    },
    {
      _id: '2',
      name: 'Office Building',
      description: 'A commercial office building with 5 floors',
      userId: 'user_2',
      landArea: 10000,
      landUnit: 'Square Feet',
      budget: 1500000,
      currency: 'USD',
      location: {
        country: 'United States',
        state: 'New York',
        city: 'New York City',
      },
      createdAt: new Date().toISOString(),
    },
  ];

  // Use mock data for demonstration
  const displayProjects = projects.length > 0 ? projects : mockProjects;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Project Management</h1>
        <p className="text-gray-400 mt-1">View and manage all projects on the platform</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-16 bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Project Name</th>
                      <th className="text-left py-3 px-4">User ID</th>
                      <th className="text-left py-3 px-4">Budget</th>
                      <th className="text-left py-3 px-4">Location</th>
                      <th className="text-left py-3 px-4">Created</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayProjects.map(project => (
                      <tr key={project._id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4">{project.name}</td>
                        <td className="py-3 px-4">{project.userId}</td>
                        <td className="py-3 px-4">{project.currency} {project.budget.toLocaleString()}</td>
                        <td className="py-3 px-4">{project.location.city}, {project.location.state}</td>
                        <td className="py-3 px-4">{new Date(project.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Link href={`/projects/${project._id}`}>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                View
                              </Button>
                            </Link>
                            
                            <Button 
                              variant="destructive" 
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              disabled={isDeleting}
                              onClick={() => deleteProject(project._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
