import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Eraser, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignaturePadProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  className?: string;
}

const SignaturePad = ({ id, label, onChange, className }: SignaturePadProps) => {
  const sigPadRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  
  const clear = () => {
    sigPadRef.current?.clear();
    setIsEmpty(true);
    onChange("");
  };

  const handleEnd = () => {
    if (sigPadRef.current) {
      if (sigPadRef.current.isEmpty()) {
        setIsEmpty(true);
        onChange("");
      } else {
        setIsEmpty(false);
        // Direct access to the internal canvas instead of getTrimmedCanvas which seems to be causing issues
        const canvas = sigPadRef.current.getCanvas();
        const dataUrl = canvas.toDataURL("image/png");
        onChange(dataUrl);
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <PenTool className="w-3.5 h-3.5" />
          {label}
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          disabled={isEmpty}
          className="h-7 text-xs text-muted-foreground hover:text-destructive transition-colors px-2"
        >
          <Eraser className="w-3.5 h-3.5 mr-1.5" />
          Obriši
        </Button>
      </div>
      
      <div className="rounded-xl overflow-hidden bg-white shadow-sm border border-input transition-all duration-300 hover:border-primary/50 hover:shadow-md focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
        <SignatureCanvas
          ref={sigPadRef}
          penColor="black"
          canvasProps={{
            className: "w-full h-40 cursor-crosshair bg-white touch-none",
          }}
          onEnd={handleEnd}
        />
        <div className="bg-slate-50/80 backdrop-blur-sm border-t px-3 py-1.5 text-[10px] text-muted-foreground text-center select-none">
          Potpišite se prstom ili mišem u polje iznad
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
