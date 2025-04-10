'use client';

import { useEffect, useState } from 'react';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    // Only initialize once
    if (dbInitialized) return;

    // Initialize the database
    const initDb = async () => {
      try {
        // First check if the database is reachable
        const pingResponse = await fetch('/api/db/ping', {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' }
        });

        if (pingResponse.ok) {
          console.log('Database connection verified');

          // Now initialize the database collections
          const initResponse = await fetch('/api/db/init', {
            method: 'POST',
            headers: { 'Cache-Control': 'no-cache' }
          });

          if (initResponse.ok) {
            const result = await initResponse.json();
            console.log('Database initialization result:', result);
            setDbInitialized(true);
          } else {
            console.error('Database initialization failed:', await initResponse.text());
          }
        } else {
          console.error('Database connection check failed:', await pingResponse.text());
        }
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    };

    // Delay the initialization slightly to avoid memory pressure during app startup
    const timer = setTimeout(() => {
      initDb();
    }, 1000);

    return () => clearTimeout(timer);
  }, [dbInitialized]);

  return <>{children}</>;
}

export default DatabaseProvider;
