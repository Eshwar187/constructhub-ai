'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'JPY'];
const landUnits = ['Square Feet', 'Square Meters', 'Acres', 'Hectares'];

// Mock data for countries, states, and cities
const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'Singapore'];
const states = {
  'United States': ['California', 'New York', 'Texas', 'Florida', 'Washington'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
  'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
  'India': ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Telangana'],
  'Singapore': ['Central Region', 'East Region', 'North Region', 'North-East Region', 'West Region'],
};
const cities = {
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse'],
  'Texas': ['Houston', 'Austin', 'Dallas', 'San Antonio'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Bellevue'],
  'England': ['London', 'Manchester', 'Birmingham', 'Liverpool'],
  'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'],
  'Wales': ['Cardiff', 'Swansea', 'Newport', 'Bangor'],
  'Northern Ireland': ['Belfast', 'Derry', 'Lisburn', 'Newry'],
  'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton'],
  'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau'],
  'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'],
  'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'],
  'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast'],
  'Victoria': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
  'Queensland': ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville'],
  'Western Australia': ['Perth', 'Fremantle', 'Mandurah', 'Bunbury'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Central Region': ['Downtown Core', 'Orchard', 'Marina South', 'Rochor'],
  'East Region': ['Bedok', 'Tampines', 'Pasir Ris', 'Changi'],
  'North Region': ['Woodlands', 'Sembawang', 'Yishun', 'Mandai'],
  'North-East Region': ['Hougang', 'Serangoon', 'Punggol', 'Sengkang'],
  'West Region': ['Jurong East', 'Clementi', 'Bukit Batok', 'Choa Chu Kang'],
};

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    landArea: '',
    landUnit: 'Square Feet',
    budget: '',
    currency: 'USD',
    location: {
      country: '',
      state: '',
      city: '',
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData] as Record<string, string>,
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Reset dependent fields when country or state changes
    if (name === 'location.country') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          country: value,
          state: '',
          city: '',
        },
      });
    } else if (name === 'location.state') {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          state: value,
          city: '',
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.description || !formData.landArea || !formData.budget ||
        !formData.location.country || !formData.location.state || !formData.location.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    toast('Creating project...');

    try {
      console.log('Submitting project data:', {
        ...formData,
        landArea: parseFloat(formData.landArea),
        budget: parseFloat(formData.budget),
      });

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          landArea: parseFloat(formData.landArea),
          budget: parseFloat(formData.budget),
        }),
      });

      const data = await response.json();
      console.log('Project creation response:', data);

      if (response.ok) {
        toast.success('Project created successfully');
        // Force a delay before navigation to ensure the toast is shown
        setTimeout(() => {
          router.push(`/projects/${data._id}`);
        }, 500);
      } else {
        console.error('Failed to create project:', data);
        toast.error(data.error || 'Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('An error occurred while creating the project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black"></div>
      <div className="fixed inset-0 -z-10 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      <div className="fixed top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]"></div>
      <div className="fixed bottom-0 left-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient-text">Create New Project</h1>
        </div>
        <p className="text-gray-400 ml-4 pl-6">Fill in the details to create your construction project</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass-effect border-gray-800 shadow-xl shadow-blue-900/5">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription className="text-gray-400">
                Provide basic information about your construction project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Project Name</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Modern Family Home"
                      className="bg-gray-800/50 border-gray-700 text-white mt-1 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <div className="absolute inset-0 rounded-md -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <div className="relative">
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description of your project"
                      className="bg-gray-800/50 border-gray-700 text-white mt-1 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <div className="absolute inset-0 rounded-md -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="landArea">Land Area</Label>
                    <div className="relative">
                      <Input
                        id="landArea"
                        name="landArea"
                        type="number"
                        value={formData.landArea}
                        onChange={handleChange}
                        placeholder="e.g., 2500"
                        className="bg-gray-800/50 border-gray-700 text-white mt-1 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                        required
                      />
                      <div className="absolute inset-0 rounded-md -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="landUnit">Unit</Label>
                    <select
                      id="landUnit"
                      name="landUnit"
                      value={formData.landUnit}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border-gray-700 text-white rounded-md mt-1 p-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    >
                      {landUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget</Label>
                    <div className="relative">
                      <Input
                        id="budget"
                        name="budget"
                        type="number"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="e.g., 250000"
                        className="bg-gray-800/50 border-gray-700 text-white mt-1 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                        required
                      />
                      <div className="absolute inset-0 rounded-md -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border-gray-700 text-white rounded-md mt-1 p-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Location</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <select
                      id="country"
                      name="location.country"
                      value={formData.location.country}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border-gray-700 text-white rounded-md mt-1 p-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <select
                      id="state"
                      name="location.state"
                      value={formData.location.state}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border-gray-700 text-white rounded-md mt-1 p-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                      disabled={!formData.location.country}
                      required
                    >
                      <option value="">Select State/Province</option>
                      {formData.location.country &&
                        states[formData.location.country as keyof typeof states]?.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <select
                      id="city"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      className="w-full bg-gray-800/50 border-gray-700 text-white rounded-md mt-1 p-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                      disabled={!formData.location.state}
                      required
                    >
                      <option value="">Select City</option>
                      {formData.location.state &&
                        cities[formData.location.state as keyof typeof cities]?.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-700/20 transition-all duration-300 hover:shadow-blue-700/40 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  'Create Project'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
