import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { CheckCircle2, Download } from "lucide-react";
import { motion } from "framer-motion";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuccessDialog = ({ open, onOpenChange }: SuccessDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md border-none bg-white/90 backdrop-blur-xl shadow-2xl">
        <AlertDialogHeader className="items-center text-center space-y-4 pt-4">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2"
          >
            <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
          </motion.div>
          <AlertDialogTitle className="text-2xl font-bold text-slate-800">
            Uspešno generisano!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-slate-600">
            Vaš reklamacioni list je kreiran i preuzimanje je započelo automatski.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center pt-4 pb-2">
          <AlertDialogAction 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 py-6 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => onOpenChange(false)}
          >
            <Download className="w-5 h-5 mr-2" />
            Zatvori
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuccessDialog;
