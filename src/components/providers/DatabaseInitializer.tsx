'use client';

import { useEffect, useState } from 'react';

export function DatabaseInitializer() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Call the startup API to clear sessions
        const response = await fetch('/api/db/startup');
        if (response.ok) {
          const data = await response.json();
          console.log('Database startup successful:', data.message);
          setInitialized(true);
        } else {
          console.error('Failed to initialize database on startup');
        }
      } catch (error) {
        console.error('Error initializing database on startup:', error);
      }
    };

    // Initialize the database on component mount
    initializeDatabase();
  }, []);

  // This component doesn't render anything
  return null;
}

export default DatabaseInitializer;
