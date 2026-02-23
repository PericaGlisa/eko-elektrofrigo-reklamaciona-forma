import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -5, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -5, height: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 mt-1.5 text-destructive overflow-hidden"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <p className="text-xs font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
