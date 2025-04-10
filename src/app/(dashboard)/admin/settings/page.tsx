'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  
  // General settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'ConstructHub.ai',
    siteDescription: 'AI-powered construction project planning and management platform',
    contactEmail: 'admin@constructhub.ai',
  });

  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    mailjetApiKey: 'f1cd4094579f3af884060150d9144558',
    mailjetApiSecret: '91b7cd6d9a4808146a731815a27aad7a',
    fromEmail: 'jeshwar09052005@outlook.com',
    fromName: 'ConstructHub.ai',
  });

  // API settings
  const [apiSettings, setApiSettings] = useState({
    huggingfaceApiKey: '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',
    mongodbUri: 'mongodb+srv://eshwar2005:Eshwar123@cluster0.1zjx9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: value,
    });
  };

  const handleApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiSettings({
      ...apiSettings,
      [name]: value,
    });
  };

  const saveSettings = (settingType: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`${settingType} settings saved successfully`);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-gray-400 mt-1">Configure platform settings and integrations</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure basic platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralChange}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    name="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={handleGeneralChange}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={handleGeneralChange}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => saveSettings('General')}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="email" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure Mailjet integration for sending emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mailjetApiKey">Mailjet API Key</Label>
                  <Input
                    id="mailjetApiKey"
                    name="mailjetApiKey"
                    type="password"
                    value={emailSettings.mailjetApiKey}
                    onChange={handleEmailChange}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="mailjetApiSecret">Mailjet API Secret</Label>
                  <Input
                    id="mailjetApiSecret"
                    name="mailjetApiSecret"
                    type="password"
                    value={emailSettings.mailjetApiSecret}
                    onChange={handleEmailChange}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    name="fromEmail"
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={handleEmailChange}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    name="fromName"
                    value={emailSettings.fromName}
                    onChange={handleEmailChange}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => saveSettings('Email')}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="mt-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure API keys for external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="huggingfaceApiKey">Hugging Face API Key</Label>
                  <Input
                    id="huggingfaceApiKey"
                    name="huggingfaceApiKey"
                    type="password"
                    value={apiSettings.huggingfaceApiKey}
                    onChange={handleApiChange}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="mongodbUri">MongoDB URI</Label>
                  <Input
                    id="mongodbUri"
                    name="mongodbUri"
                    type="password"
                    value={apiSettings.mongodbUri}
                    onChange={handleApiChange}
                    className="bg-gray-700 border-gray-600 text-white mt-1"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => saveSettings('API')}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
