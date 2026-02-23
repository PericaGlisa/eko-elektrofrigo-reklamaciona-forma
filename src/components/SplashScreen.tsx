import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950 text-white overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-green-600/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-700" />
            <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-cyan-400/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center mb-6"
            >
              <div className="relative w-24 h-24 bg-gradient-to-br from-white to-slate-300 rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/20 rotate-3">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">EF</span>
                <div className="absolute inset-0 rounded-2xl border border-white/50" />
                
                {/* Decorative Elements */}
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border border-white/10 rounded-full border-dashed"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400"
            >
              EKO Elektrofrigo
            </motion.h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 bg-gradient-to-r from-green-500 to-blue-500 mt-6 rounded-full"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-4 text-slate-400 font-medium tracking-widest text-xs uppercase"
            >
              Digitalni Sistem za Reklamacije
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
