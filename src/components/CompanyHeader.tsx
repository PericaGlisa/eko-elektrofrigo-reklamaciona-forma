import ekoLogo from "@/assets/eko-logo.png";
import { COMPANY } from "@/lib/companyInfo";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Globe, FileText, ArrowUpRight } from "lucide-react";

const CompanyHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-2xl shadow-slate-200/50 backdrop-blur-xl"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-gradient-to-tr from-cyan-400/10 to-green-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 relative z-10">
        {/* Logo Section */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex-shrink-0 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
          <div className="relative transition-transform duration-300 group-hover:scale-105 p-2">
            <img src={ekoLogo} alt="EKO Elektrofrigo logo" className="h-20 w-auto object-contain drop-shadow-sm" />
          </div>
        </motion.div>

        {/* Company Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex-1 text-center md:text-right space-y-5"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              {COMPANY.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-sm text-slate-500 mt-2">
              <span className="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-full border border-slate-200/50 hover:bg-white hover:shadow-sm transition-all duration-300">
                <FileText className="w-3.5 h-3.5 text-primary" />
                PIB: <span className="font-semibold text-slate-700">{COMPANY.pib}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100/50 px-3 py-1.5 rounded-full border border-slate-200/50 hover:bg-white hover:shadow-sm transition-all duration-300">
                <FileText className="w-3.5 h-3.5 text-primary" />
                MB: <span className="font-semibold text-slate-700">{COMPANY.mb}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center justify-center md:justify-end gap-4 text-sm text-slate-600">
            <div className="flex items-center justify-center md:justify-end gap-2 group cursor-default">
              <div className="p-1.5 rounded-full bg-slate-100/80 text-slate-500 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="group-hover:text-slate-900 transition-colors">Svetolika Nikačevića 11, Beograd</span>
            </div>
            
            <div className="flex items-center justify-center md:justify-end gap-2 group cursor-default">
              <div className="p-1.5 rounded-full bg-slate-100/80 text-slate-500 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="group-hover:text-slate-900 transition-colors font-medium tabular-nums">{COMPANY.tel[0]}</span>
            </div>
            
            <div className="flex items-center justify-center md:justify-end gap-2 group cursor-default">
              <div className="p-1.5 rounded-full bg-slate-100/80 text-slate-500 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="group-hover:text-slate-900 transition-colors">{COMPANY.emails[0]}</span>
            </div>
            
            <a 
              href={`https://${COMPANY.web}`} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center md:justify-end gap-2 group cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <span className="text-primary font-semibold flex items-center gap-0.5">
                {COMPANY.web}
                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompanyHeader;
