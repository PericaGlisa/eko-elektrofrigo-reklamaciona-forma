import ComplaintForm from "@/components/ComplaintForm";
import { SplashScreen } from "@/components/SplashScreen";
import { Snowflake } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden selection:bg-primary/20 selection:text-primary">
      <SplashScreen />
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-cyan-400/5 blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Decorative floating elements */}
      <div className="fixed top-20 left-10 opacity-[0.02] pointer-events-none z-0">
        <Snowflake className="w-64 h-64 text-primary animate-float" strokeWidth={0.5} />
      </div>
      <div className="fixed bottom-20 right-10 opacity-[0.02] pointer-events-none z-0" style={{ animationDelay: "1.5s" }}>
        <Snowflake className="w-48 h-48 text-blue-500 animate-float" strokeWidth={0.5} />
      </div>

      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-primary via-blue-500 to-cyan-400 shadow-glow" />

      <main className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <ComplaintForm />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 bg-white/40 backdrop-blur-md mt-12">
        <div className="max-w-5xl mx-auto py-8 px-4 flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()} EKO Elektrofrigo DOO, Beograd
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
            <a href="https://www.eef.rs" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">www.eef.rs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
