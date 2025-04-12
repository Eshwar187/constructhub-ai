'use client';

import React, { useState, useEffect } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { useUser as useMockUser } from '@/lib/clerk-mock';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { UserInfoCard } from '@/components/dashboard/UserInfoCard';

interface Project {
  _id: string;
  name: string;
  description: string;
  budget: number;
  currency: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  createdAt: string;
}

export default function DashboardPage(): React.ReactElement {
  // Use either the real Clerk hook or our mock hook based on environment
  const { user } = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true'
    ? useMockUser()
    : useClerkUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a Clerk DB JWT parameter in the URL
    const hasClerkDbJwt = window.location.search.includes('__clerk_db_jwt');

    if (hasClerkDbJwt) {
      // Clean the URL by removing the JWT parameter
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

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

  return (
    <div className="space-y-8 relative min-h-screen">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
      <div className="fixed inset-0 -z-10 cyberpunk-grid"></div>

      {/* Animated background elements */}
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]"></div>
      <div className="fixed bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px]"></div>

      {/* Floating elements */}
      <motion.div
        className="fixed top-1/4 right-1/4 w-32 h-32 border border-blue-500/10 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-1/3 left-1/4 w-48 h-48 border border-purple-500/10 rounded-full"
        animate={{
          y: [0, 30, 0],
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient-text neon-blue">Welcome, {user?.firstName || user?.username}</h1>
          </div>
          <p className="text-gray-400 ml-4 pl-6">Manage your construction projects and get AI-powered insights</p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40 hover:scale-105 btn-3d">
            <span className="mr-2">+</span> Create New Project
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10"
      >
        {/* User Info Card from MongoDB */}
        <div className="mb-8">
          <UserInfoCard />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Your Projects</h2>
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="h-6 bg-gray-700 rounded animate-pulse w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-full mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6 mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-4/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                <Link href={`/projects/${project._id}`}>
                  <Card className="frosted-glass transition-all duration-300 cursor-pointer h-full border-gray-800 group hover:border-blue-900/50 hover:scale-[1.02] hover:-translate-y-1 animated-border glow">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                    <div className="relative z-10">
                    </div>
                    <CardHeader>
                      <CardTitle className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">{project.description}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">{project.currency} {project.budget.toLocaleString()}</span>
                        </span>
                        <span className="text-gray-400 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-400 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span className="group-hover:text-white transition-colors duration-300">{project.location.city}, {project.location.state}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="frosted-glass border-gray-800 p-8 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">No Projects Yet</h3>
                <p className="text-gray-400 mb-4">You don't have any projects yet. Get started by creating your first project.</p>
              </div>
              <Link href="/projects/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40 hover:scale-105 btn-3d">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Create Your First Project
                  </span>
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
