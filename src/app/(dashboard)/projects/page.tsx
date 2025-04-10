'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-gray-400 mt-1">Manage your construction projects</p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create New Project
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
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
                  <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          Budget: <span className="text-white font-medium">{project.currency} {project.budget.toLocaleString()}</span>
                        </span>
                        <span className="text-gray-400">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-400">
                        Location: <span className="text-white">{project.location.city}, {project.location.state}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-800 border-gray-700 p-8 text-center">
            <p className="text-gray-400 mb-4">You don't have any projects yet.</p>
            <Link href="/projects/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Your First Project
              </Button>
            </Link>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
