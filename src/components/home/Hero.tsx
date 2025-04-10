"use client";

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
// import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Client-only component for floating particles
const FloatingParticles = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Only render particles on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(30)].map((_, i) => {
        // Use seeded random values instead of Math.random()
        const width = 2 + ((i * 13) % 8);
        const height = 2 + ((i * 17) % 8);
        const left = `${(i * 7) % 100}%`;
        const top = `${(i * 11) % 100}%`;
        const xMove = ((i * 19) % 100) - 50;
        const yMove = ((i * 23) % 100) - 50;
        const duration = 10 + ((i * 29) % 20);

        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-blue-500' : i % 3 === 1 ? 'bg-purple-500' : 'bg-cyan-500'} opacity-${i % 5 + 1}0`}
            style={{
              width,
              height,
              left,
              top,
              filter: 'blur(1px)',
            }}
            animate={{
              x: [0, xMove],
              y: [0, yMove],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
};
// import ReactAudioPlayer from 'react-audio-player';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  // Audio player temporarily disabled
  // const audioRef = useRef<ReactAudioPlayer>(null);
  // const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // GSAP animation temporarily disabled
    // if (heroRef.current) {
    //   gsap.fromTo(
    //     heroRef.current.querySelectorAll('.gsap-hero-element'),
    //     {
    //       y: 100,
    //       opacity: 0,
    //     },
    //     {
    //       y: 0,
    //       opacity: 1,
    //       stagger: 0.2,
    //       duration: 1,
    //       ease: 'power3.out',
    //     }
    //   );
    // }
  }, []);

  // Audio player temporarily disabled
  // const toggleAudio = () => {
  //   if (audioRef.current) {
  //     const audio = audioRef.current.audioEl.current;
  //     if (isPlaying) {
  //       audio.pause();
  //     } else {
  //       audio.play();
  //     }
  //     setIsPlaying(!isPlaying);
  //   }
  // };

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 overflow-hidden"
    >
      {/* Enhanced background with vibrant colors */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-purple-900/30 to-black z-0"></div>

      {/* Animated grid lines with perspective effect */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:50px_50px] z-10 animate-[pulse_4s_ease-in-out_infinite]"></div>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-5"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden z-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-yellow-500' : i % 3 === 1 ? 'bg-blue-500' : 'bg-pink-500'}`}
            style={{
              width: `${4 + (i % 4)}px`,
              height: `${4 + (i % 4)}px`,
              top: `${(i * 5) % 100}%`,
              left: `${(i * 7) % 100}%`,
              opacity: 0.6,
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Glowing orb effect */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] z-0"></div>

      {/* Hero content with enhanced animations */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 flex items-center justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full blur-md bg-gradient-to-r from-blue-600 to-purple-600 opacity-75"></div>
            <div className="relative bg-black rounded-full p-2 border border-gray-800">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#paint0_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="url(#paint0_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="url(#paint0_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6"/>
                    <stop offset="1" stopColor="#8B5CF6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-extrabold text-center mb-6 drop-shadow-[0_0_30px_rgba(59,130,246,0.8)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="relative inline-block">
            {/* Glow effect behind text */}
            <span className="absolute -inset-8 blur-3xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full"></span>

            {/* Main text with solid color for better visibility */}
            <span className="relative">
              <span className="text-white">Construct</span>
              <span className="text-yellow-400">Hub</span>
              <span className="text-white">.ai</span>
            </span>

            {/* Animated underline */}
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></span>
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-6"
        />

        <motion.div
          className="relative max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Background glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-70"></div>

          {/* Content box */}
          <div className="relative backdrop-blur-md py-6 px-8 rounded-xl bg-black/40 border border-white/10 shadow-2xl">
            <p className="text-2xl md:text-3xl text-center leading-relaxed text-white">
              The <span className="font-bold text-yellow-400">next generation</span> platform for construction project planning and management with <span className="font-bold text-pink-400">AI-powered</span> insights and <span className="font-bold text-blue-400">intelligent</span> floor plans
            </p>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row gap-6 mb-16 justify-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* User Login Button */}
          <Link href="/sign-in" className="w-full md:w-auto">
            <Button size="lg" className="w-full md:w-auto py-8 text-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-10 shadow-xl shadow-yellow-700/30 transition-all duration-300 hover:shadow-yellow-700/50 hover:scale-105 relative overflow-hidden group rounded-xl border-2 border-yellow-400">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 animate-pulse-slow"></span>
              <span className="absolute -inset-x-2 bottom-0 h-1 w-full bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-70"></span>
              <span className="relative flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                User Login
              </span>
            </Button>
          </Link>

          {/* User Signup Button */}
          <Link href="/sign-up" className="w-full md:w-auto">
            <Button size="lg" className="w-full md:w-auto py-8 text-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-10 shadow-xl shadow-blue-700/30 transition-all duration-300 hover:shadow-blue-700/50 hover:scale-105 relative overflow-hidden group rounded-xl border-2 border-blue-400">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/20 to-blue-500/20 animate-pulse-slow"></span>
              <span className="absolute -inset-x-2 bottom-0 h-1 w-full bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-70"></span>
              <span className="relative flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                User Signup
              </span>
            </Button>
          </Link>

          {/* Admin Login Button */}
          <Link href="/admin/sign-in" className="w-full md:w-auto">
            <Button size="lg" className="w-full md:w-auto py-8 text-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold px-10 shadow-xl shadow-purple-700/30 transition-all duration-300 hover:shadow-purple-700/50 hover:scale-105 relative overflow-hidden group rounded-xl border-2 border-purple-400">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-400/20 to-pink-500/20 animate-pulse-slow"></span>
              <span className="absolute -inset-x-2 bottom-0 h-1 w-full bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-70"></span>
              <span className="relative flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Admin Login
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Enhanced Features section with 3D cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full relative z-10 mt-12">
        <div className="absolute -inset-x-10 -top-10 h-px w-[calc(100%+80px)] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>
        <div className="absolute -inset-x-10 -bottom-10 h-px w-[calc(100%+80px)] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50"></div>
        {[
          {
            title: 'Smart Project Planning',
            description: 'Create detailed construction projects with AI-generated floor plans and blueprints.',
            icon: (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 22H22" stroke="url(#paint1_linear)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.95 22L3 9.97C3 9.36 3.29 8.78 3.77 8.4L10.77 2.95C11.49 2.39 12.5 2.39 13.23 2.95L20.23 8.39C20.72 8.77 21 9.34 21 9.97V22" stroke="url(#paint1_linear)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round"/>
                <path d="M15 22V16C15 15.45 14.55 15 14 15H10C9.45 15 9 15.45 9 16V22" stroke="url(#paint1_linear)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 9.5H11C10.45 9.5 10 9.05 10 8.5V7.5C10 6.95 10.45 6.5 11 6.5H13C13.55 6.5 14 6.95 14 7.5V8.5C14 9.05 13.55 9.5 13 9.5Z" stroke="url(#paint1_linear)" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint1_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6"/>
                    <stop offset="1" stopColor="#8B5CF6"/>
                  </linearGradient>
                </defs>
              </svg>
            ),
            gradient: 'from-blue-500 to-cyan-500',
          },
          {
            title: 'Budget Management',
            description: 'Track and manage your construction budget with real-time cost estimates and suggestions.',
            icon: (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#paint2_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.5 9C14.5 7.62 13.38 6.5 12 6.5C10.62 6.5 9.5 7.62 9.5 9C9.5 10.38 10.62 11.5 12 11.5C13.38 11.5 14.5 12.62 14.5 14C14.5 15.38 13.38 16.5 12 16.5C10.62 16.5 9.5 15.38 9.5 14" stroke="url(#paint2_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17.5V16.5" stroke="url(#paint2_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6.5V5.5" stroke="url(#paint2_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint2_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B5CF6"/>
                    <stop offset="1" stopColor="#EC4899"/>
                  </linearGradient>
                </defs>
              </svg>
            ),
            gradient: 'from-purple-500 to-pink-500',
          },
          {
            title: 'Professional Network',
            description: 'Connect with local professionals and get recommendations based on your project needs.',
            icon: (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z" stroke="url(#paint3_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.97 14.44C18.34 14.67 19.85 14.43 20.91 13.72C22.32 12.78 22.32 11.24 20.91 10.3C19.84 9.59 18.31 9.35 16.94 9.59" stroke="url(#paint3_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.97 7.16C6.03 7.15 6.1 7.15 6.16 7.16C7.54 7.11 8.64 5.98 8.64 4.58C8.64 3.15 7.49 2 6.06 2C4.63 2 3.48 3.16 3.48 4.58C3.49 5.98 4.59 7.11 5.97 7.16Z" stroke="url(#paint3_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 14.44C5.63 14.67 4.12 14.43 3.06 13.72C1.65 12.78 1.65 11.24 3.06 10.3C4.13 9.59 5.66 9.35 7.03 9.59" stroke="url(#paint3_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.33 13.45 9.33 12.05C9.33 10.62 10.48 9.47 11.91 9.47C13.34 9.47 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z" stroke="url(#paint3_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.09 17.78C7.68 18.72 7.68 20.26 9.09 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.09 17.78Z" stroke="url(#paint3_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="paint3_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#10B981"/>
                    <stop offset="1" stopColor="#3B82F6"/>
                  </linearGradient>
                </defs>
              </svg>
            ),
            gradient: 'from-green-500 to-blue-500',
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r border border-gray-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-0.5 blur-sm" style={{ background: `linear-gradient(90deg, var(--tw-gradient-stops))`, backgroundImage: `linear-gradient(to right, ${feature.gradient.split(' ')[0].replace('from-', 'var(--tw-gradient-from)')}, ${feature.gradient.split(' ')[1].replace('to-', 'var(--tw-gradient-to)')})` }}></div>
            <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl border border-gray-800 relative h-full transform transition-all duration-500 hover:translate-z-10 hover:scale-105 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-xl -z-10 transform transition-transform duration-500 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px] rounded-xl opacity-30 -z-5"></div>

              <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-[-5px]">
                <div className="relative">
                  <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">{feature.icon}</div>
                </div>
              </div>

              <h3 className={`text-xl font-semibold mb-3 bg-gradient-to-r bg-clip-text text-transparent ${feature.gradient} drop-shadow-sm`}>{feature.title}</h3>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-3 opacity-50"></div>

              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>

              <div className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-b-xl" style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))`, backgroundImage: `linear-gradient(to right, ${feature.gradient.split(' ')[0].replace('from-', 'var(--tw-gradient-from)')}, ${feature.gradient.split(' ')[1].replace('to-', 'var(--tw-gradient-to)')})` }}></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Audio player - Temporarily disabled until audio file is available */}
      {/* <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-gray-800 p-2 rounded-full">
        <Button
          size="sm"
          variant="ghost"
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
          onClick={toggleAudio}
        >
          {isPlaying ? (
            <span className="text-xl">🔊</span>
          ) : (
            <span className="text-xl">🔇</span>
          )}
        </Button>
        <ReactAudioPlayer
          ref={audioRef}
          src="/background-music.mp3"
          loop
          volume={0.3}
          className="hidden"
        />
      </div> */}
    </div>
  );
};

export default Hero;
