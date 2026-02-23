import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FormSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  index?: number;
}

const FormSection = ({ title, icon, children, index = 0 }: FormSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
      className="premium-card group relative overflow-hidden"
    >
      <div className="relative px-6 py-5 border-b border-white/20 bg-gradient-to-r from-slate-50/50 to-white/50 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative flex items-center gap-4">
          {index > 0 && (
            <span className="font-heading font-black text-4xl text-slate-200 select-none absolute -left-1 -top-1 opacity-50">
              {index.toString().padStart(2, '0')}
            </span>
          )}
          
          <div className="relative z-10 flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <div className="text-primary group-hover:text-blue-600 transition-colors duration-300">
              {icon}
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col">
            <h2 className="font-heading font-bold text-lg tracking-tight text-slate-800 group-hover:text-primary transition-colors duration-300">
              {title}
            </h2>
            <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-700 ease-out rounded-full mt-1" />
          </div>
        </div>
      </div>
      
      <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-white/40 to-transparent">
        {children}
      </div>
    </motion.div>
  );
};

export default FormSection;
