'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface Project {
  _id: string;
  name: string;
  description: string;
  userId: string;
  budget: number;
  currency: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if there's a Clerk DB JWT parameter in the URL
    const hasClerkDbJwt = window.location.search.includes('__clerk_db_jwt');

    if (hasClerkDbJwt) {
      // Clean the URL by removing the JWT parameter
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          toast.error('Failed to fetch users');
        }
      } catch (error) {
        toast.error('An error occurred while fetching users');
      } finally {
        setIsLoadingUsers(false);
      }
    };

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
        setIsLoadingProjects(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/admin/activities');
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        } else {
          toast.error('Failed to fetch admin activities');
        }
      } catch (error) {
        toast.error('An error occurred while fetching admin activities');
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchUsers();
    fetchProjects();
    fetchActivities();
  }, []);

  // Function to delete a user
  const deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        setIsDeletingUser(true);

        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('User deleted successfully');
          // Remove the user from the state
          setUsers(users.filter(user => user._id !== userId));
        } else {
          const data = await response.json();
          toast.error(data.error || 'Failed to delete user');
        }
      } catch (error) {
        toast.error('An error occurred while deleting the user');
      } finally {
        setIsDeletingUser(false);
      }
    }
  };

  // Use real data from MongoDB
  const displayUsers = users;
  const displayProjects = projects;

  const totalUsers = displayUsers.length;
  const totalProjects = displayProjects.length;
  const verifiedUsers = displayUsers.filter(user => user.isVerified).length;
  const adminUsers = displayUsers.filter(user => user.role === 'admin').length;

  // Show loading state if data is still loading
  if (isLoadingUsers || isLoadingProjects) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage users, projects, and platform settings</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Verified Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{verifiedUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{adminUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-normal">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalProjects}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-card border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activities">Admin Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayUsers.slice(0, 3).map(user => (
                    <div key={user._id} className="flex justify-between items-center border-b border-border pb-3">
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">Registered: {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${user.isVerified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Username</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Role</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Registered</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayUsers.map(user => (
                        <tr key={user._id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{user.username}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${user.isVerified ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            {user.email !== 'eshwar09052005@gmail.com' && (
                              <button
                                onClick={() => deleteUser(user._id)}
                                disabled={isDeletingUser}
                                className="px-2 py-1 bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Project Name</th>
                        <th className="text-left py-3 px-4">User ID</th>
                        <th className="text-left py-3 px-4">Budget</th>
                        <th className="text-left py-3 px-4">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayProjects.map(project => (
                        <tr key={project._id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{project.name}</td>
                          <td className="py-3 px-4">{project.userId}</td>
                          <td className="py-3 px-4">{project.currency} {project.budget.toLocaleString()}</td>
                          <td className="py-3 px-4">{new Date(project.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Admin Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Admin</th>
                        <th className="text-left py-3 px-4">Action</th>
                        <th className="text-left py-3 px-4">Details</th>
                        <th className="text-left py-3 px-4">IP Address</th>
                        <th className="text-left py-3 px-4">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => (
                        <tr key={activity._id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">{activity.adminEmail}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              activity.action === 'login' ? 'bg-green-900 text-green-300' :
                              activity.action === 'logout' ? 'bg-red-900 text-red-300' :
                              'bg-blue-900 text-blue-300'
                            }`}>
                              {activity.action}
                            </span>
                          </td>
                          <td className="py-3 px-4">{activity.details}</td>
                          <td className="py-3 px-4">{activity.ipAddress}</td>
                          <td className="py-3 px-4">{new Date(activity.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
