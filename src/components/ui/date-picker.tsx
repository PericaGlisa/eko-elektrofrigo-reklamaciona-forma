import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { srLatn } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date | string;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  className,
  disabled = false,
  id,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      setDate(new Date(value));
    } else {
      setDate(undefined);
    }
  }, [value]);

  const handleSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
    setIsOpen(false);
  };
  
  const isFloating = date || isOpen;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative group w-full cursor-pointer">
            <Button
              variant={"outline"}
              disabled={disabled}
              id={id}
              type="button"
              className={cn(
                "w-full justify-start text-left font-normal h-14 pt-6 pb-2 px-4 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md",
                isOpen && "border-primary ring-4 ring-primary/10 bg-white",
                !date && "text-muted-foreground",
                className
              )}
            >
              <CalendarIcon className={cn("mr-2 h-4 w-4 text-primary transition-opacity duration-200", isFloating ? "opacity-100" : "opacity-0")} />
              {date ? (
                format(date, "PPP", { locale: srLatn })
              ) : (
                <span className="opacity-0">Placeholder</span> 
              )}
            </Button>
            <label
              htmlFor={id}
              className={cn(
                "absolute left-4 top-4 z-10 origin-[0] transform transition-all duration-300 pointer-events-none font-medium",
                isFloating 
                  ? "-translate-y-2.5 scale-75" 
                  : "translate-y-0 scale-100",
                isOpen ? "text-primary" : "text-muted-foreground"
              )}
            >
              {label}
            </label>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={srLatn}
          className="rounded-xl border border-slate-100 shadow-xl"
        />
      </PopoverContent>
    </Popover>
  );
}
