import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { complaintSchema, ComplaintFormData } from "@/lib/formSchema";
import { PRODUCT_CATEGORIES } from "@/lib/companyInfo";
import { generatePDF } from "@/lib/pdfGenerator";
import CompanyHeader from "./CompanyHeader";
import FormSection from "./FormSection";
import ProgressHeader from "./ProgressHeader";
import SuccessDialog from "./SuccessDialog";
import SignaturePad from "./SignaturePad";
import { FloatingLabelInput } from "@/components/ui/floating-input";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FileDown,
  ClipboardList,
  Package,
  FileText,
  ShieldCheck,
  PenTool,
  Loader2,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const steps = [
  { id: "section-1", title: "Opšti podaci" },
  { id: "section-2", title: "Kategorija" },
  { id: "section-3", title: "Proizvod" },
  { id: "section-4", title: "Opis" },
  { id: "section-5", title: "Garancija" },
  { id: "section-6", title: "Potpisi" },
];

const ComplaintForm = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      receptionDate: new Date().toISOString().split("T")[0],
      categories: [],
      warrantyStatus: "in_warranty",
    },
  });

  const selectedCategories = watch("categories") || [];

  // Generate automatic complaint number
  useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, ""); // HHMMSS
    const autoNumber = `REK-${dateStr}-${timeStr}`;
    setValue("complaintNumber", autoNumber);
  }, [setValue]);

  // Register signature fields
  useEffect(() => {
    register("customerSignatureImage");
    register("serviceSignatureImage");
  }, [register]);

  // Scroll tracking for progress stepper
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = steps.length - 1; i >= 0; i--) {
        const section = document.getElementById(steps[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setCurrentStep(i + 1);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCategory = (cat: string) => {
    const current = selectedCategories;
    const updated = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    setValue("categories", updated);
  };

  const onSubmit = async (data: ComplaintFormData) => {
    console.log("Form Data Submitted:", data);
    console.log("Customer Sig:", data.customerSignatureImage?.substring(0, 50));
    console.log("Service Sig:", data.serviceSignatureImage?.substring(0, 50));
    
    setIsGenerating(true);
    try {
      await generatePDF(data);
      setShowSuccess(true);
      toast.success("PDF je uspešno generisan!");
    } catch (err) {
      console.error(err);
      toast.error("Greška pri generisanju PDF-a.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <ProgressHeader currentStep={currentStep} totalSteps={steps.length} steps={steps} />
      <SuccessDialog open={showSuccess} onOpenChange={setShowSuccess} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto pt-24 sm:pt-28 px-4 sm:px-6">
        <CompanyHeader />

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center py-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            Digitalni obrazac
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Reklamacioni List
          </h1>
          <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Popunite obrazac ispod kako biste generisali zvanični reklamacioni list u PDF formatu.
          </p>
        </motion.div>

        {/* General Info */}
        <div id="section-1" className="scroll-mt-24">
          <FormSection title="Opšti podaci" icon={<ClipboardList className="h-4 w-4" />} index={1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <FloatingLabelInput 
                  id="complaintNumber" 
                  label="Broj reklamacije (automatski)" 
                  {...register("complaintNumber")} 
                  readOnly
                  className="bg-gray-50/50 cursor-default opacity-80 font-mono text-sm tracking-wide text-primary/80 border-primary/20"
                />
                <FormError message={errors.complaintNumber?.message} />
              </div>
              <div className="space-y-1.5">
                <Controller
                  control={control}
                  name="receptionDate"
                  render={({ field }) => (
                    <DatePicker
                      id="receptionDate"
                      label="Datum prijema *"
                      value={field.value}
                      onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      className="premium-input"
                    />
                  )}
                />
                <FormError message={errors.receptionDate?.message} />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <FloatingLabelInput 
                  id="customerName" 
                  label="Naziv kupca *" 
                  {...register("customerName")} 
                />
                <FormError message={errors.customerName?.message} />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <FloatingLabelInput 
                  id="address" 
                  label="Adresa *" 
                  {...register("address")} 
                />
                <FormError message={errors.address?.message} />
              </div>
              <div className="space-y-1.5">
                <FloatingLabelInput 
                  id="contactPhone" 
                  label="Telefon" 
                  {...register("contactPhone")} 
                />
              </div>
              <div className="space-y-1.5">
                <FloatingLabelInput 
                  id="contactEmail" 
                  label="Email" 
                  type="email" 
                  {...register("contactEmail")} 
                />
                <FormError message={errors.contactEmail?.message} />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Product Categories */}
        <div id="section-2" className="scroll-mt-24">
          <FormSection title="Kategorija proizvoda" icon={<Package className="h-4 w-4" />} index={2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRODUCT_CATEGORIES.map((cat) => (
                <motion.label
                  key={cat}
                  whileHover={{ scale: 1.01, backgroundColor: "hsl(var(--primary) / 0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-background/50 cursor-pointer transition-all duration-200 has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                >
                  <Checkbox
                    id={cat}
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm leading-snug font-medium text-slate-700">{cat}</span>
                </motion.label>
              ))}
            </div>
            <div className="pt-3 space-y-1.5">
              <FloatingLabelInput 
                id="categoryOther" 
                label="Ostalo (unesite kategoriju)" 
                {...register("categoryOther")} 
              />
            </div>
          </FormSection>
        </div>

        {/* Product Info */}
        <div id="section-3" className="scroll-mt-24">
          <FormSection title="Podaci o proizvodu" icon={<FileText className="h-4 w-4" />} index={3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <FloatingLabelInput label="Proizvođač / Brend" {...register("manufacturer")} />
              </div>
              <div className="space-y-1.5">
                <FloatingLabelInput label="Model" {...register("model")} />
              </div>
              <div className="space-y-1.5">
                <FloatingLabelInput label="Serijski broj" {...register("serialNumber")} />
              </div>
              <div className="space-y-1.5">
                <Controller
                  control={control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <DatePicker
                      id="purchaseDate"
                      label="Datum kupovine / instalacije"
                      value={field.value}
                      onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      className="premium-input"
                    />
                  )}
                />
              </div>
            </div>
          </FormSection>
        </div>

        {/* Description */}
        <div id="section-4" className="scroll-mt-24">
          <FormSection title="Opis reklamacije" icon={<FileText className="h-4 w-4" />} index={4}>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Opis reklamacije / kvara <span className="text-destructive">*</span>
              </Label>
              <Textarea {...register("complaintDescription")} rows={5} className="premium-input resize-none focus:ring-primary" placeholder="Detaljno opišite problem..." />
              <FormError message={errors.complaintDescription?.message} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Servisni nalaz / tehnička analiza</Label>
              <Textarea {...register("serviceFindings")} rows={5} className="premium-input resize-none focus:ring-primary" placeholder="Tehnička analiza i nalaz servisera..." />
            </div>
          </FormSection>
        </div>

        {/* Warranty */}
        <div id="section-5" className="scroll-mt-24">
          <FormSection title="Garancija" icon={<ShieldCheck className="h-4 w-4" />} index={5}>
            <RadioGroup
              defaultValue="in_warranty"
              onValueChange={(v) => setValue("warrantyStatus", v as "in_warranty" | "out_of_warranty")}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-background/50 cursor-pointer transition-all duration-200 hover:border-primary/40 has-[:checked]:border-primary has-[:checked]:bg-primary/10 flex-1 shadow-sm"
              >
                <RadioGroupItem value="in_warranty" id="in_warranty" className="text-primary border-primary" />
                <div>
                  <span className="font-semibold text-sm text-primary">U garanciji</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Proizvod je pod aktivnom garancijom</p>
                </div>
              </motion.label>
              <motion.label 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-background/50 cursor-pointer transition-all duration-200 hover:border-destructive/30 has-[:checked]:border-destructive/50 has-[:checked]:bg-destructive/5 flex-1 shadow-sm"
              >
                <RadioGroupItem value="out_of_warranty" id="out_of_warranty" className="text-destructive border-destructive" />
                <div>
                  <span className="font-semibold text-sm text-destructive">Van garancije</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Garancijski rok je istekao</p>
                </div>
              </motion.label>
            </RadioGroup>
          </FormSection>
        </div>

        {/* Signatures */}
        <div id="section-6" className="scroll-mt-24">
          <FormSection title="Potpisi" icon={<PenTool className="h-4 w-4" />} index={6}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FloatingLabelInput label="Potpis kupca (štampano)" {...register("customerSignature")} />
                </div>
                <SignaturePad 
                  id="customerSignaturePad"
                  label="Svojeručni potpis kupca"
                  onChange={(val) => setValue("customerSignatureImage", val)}
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FloatingLabelInput label="Potpis servisera (štampano)" {...register("serviceSignature")} />
                </div>
                <SignaturePad 
                  id="serviceSignaturePad"
                  label="Svojeručni potpis servisera"
                  onChange={(val) => setValue("serviceSignatureImage", val)}
                />
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex items-start sm:items-center gap-3 text-xs text-muted-foreground bg-primary/5 p-4 rounded-xl border border-primary/10"
            >
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5 sm:mt-0" />
              <p>
                <span className="font-semibold text-primary">Napomena:</span> Elektronski potpis nije obavezan. Dokument možete generisati bez potpisa i potpisati ga ručno nakon štampanja.
              </p>
            </motion.div>
          </FormSection>
        </div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center gap-3 pb-24 pt-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto"
          >
            <Button
              type="submit"
              disabled={isGenerating}
              variant="premium"
              size="xl"
              className="w-full sm:min-w-[320px] gap-3 font-heading font-bold shadow-glow hover:shadow-glow-lg transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generisanje...
                </>
              ) : (
                <>
                  <FileDown className="h-5 w-5" />
                  Generiši i preuzmi PDF
                </>
              )}
            </Button>
          </motion.div>
          <p className="text-xs text-muted-foreground text-center">
            Klikom na dugme potvrđujete tačnost unetih podataka.
          </p>
        </motion.div>
      </form>
    </>
  );
};

export default ComplaintForm;
