"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { theme } = useTheme();
  
  // Determine the theme for the toaster
  const toasterTheme = theme === "system" 
    ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") 
    : theme;

  return (
    <SonnerToaster 
      position="top-right" 
      richColors 
      closeButton 
      theme={toasterTheme as "light" | "dark"} 
    />
  );
}
