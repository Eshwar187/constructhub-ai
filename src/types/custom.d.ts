// This file contains custom type definitions for the project

// For SVG imports
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// For image imports
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// For font imports
declare module '*.woff' {
  const content: string;
  export default content;
}

declare module '*.woff2' {
  const content: string;
  export default content;
}

declare module '*.ttf' {
  const content: string;
  export default content;
}

// For JSON imports with import assertion
declare module '*.json' {
  const value: any;
  export default value;
}

// For environment variables
interface ProcessEnv {
  NEXT_PUBLIC_USE_MOCK_AUTH: string;
  MONGODB_URI: string;
  // Add other environment variables here
}

// Extend Window interface
interface Window {
  // Add custom window properties here
}

// Extend NodeJS namespace
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_USE_MOCK_AUTH: string;
    MONGODB_URI: string;
    // Add other environment variables here
  }
}
