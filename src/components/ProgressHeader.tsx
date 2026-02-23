import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  steps: { id: string; title: string }[];
}

const ProgressHeader = ({ currentStep, totalSteps, steps }: ProgressHeaderProps) => {
  const progress = (currentStep / totalSteps) * 100;
  const currentStepTitle = steps[currentStep - 1]?.title;

  return (
    <>
      {/* Floating Status Bar (Mobile & Desktop) */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center pt-2 sm:pt-6 px-2 sm:px-6"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-900/10 rounded-full pl-1.5 pr-2 py-1.5 flex items-center gap-2 sm:gap-3 pointer-events-auto max-w-full overflow-hidden ring-1 ring-black/5">
          
          {/* Logo / Home Icon */}
          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/20 ring-2 ring-white">
            <span className="font-bold text-[10px] sm:text-xs">EF</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 mx-0.5 sm:mx-1" />

          {/* Current Step Info */}
          <div className="flex flex-col px-0.5 min-w-[90px] sm:min-w-[120px] max-w-[120px] sm:max-w-none">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
              KORAK {currentStep} / {totalSteps}
            </span>
            <AnimatePresence mode="wait">
              <motion.span 
                key={currentStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[11px] sm:text-xs font-bold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {currentStepTitle}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Mini Stepper */}
          <div className="hidden md:flex items-center gap-1.5 px-2 border-l border-slate-100 ml-1">
            {steps.map((step, index) => {
              const isActive = index + 1 === currentStep;
              const isCompleted = index + 1 < currentStep;
              
              return (
                <div key={step.id} className="relative group cursor-pointer" onClick={() => {
                  const el = document.getElementById(step.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <motion.div 
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      isActive ? "bg-primary w-8 shadow-sm shadow-primary/30" : isCompleted ? "bg-primary/40" : "bg-slate-200 group-hover:bg-slate-300"
                    )}
                  />
                  {/* Tooltip */}
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl font-medium tracking-wide">
                    {step.title}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Circle */}
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center ml-1 sm:ml-0">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="44%"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                className="text-slate-100"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="44%"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                className="text-primary drop-shadow-[0_0_2px_rgba(40,180,75,0.5)]"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                strokeLinecap="round"
                style={{ strokeDasharray: "100 100" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-slate-600">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProgressHeader;
