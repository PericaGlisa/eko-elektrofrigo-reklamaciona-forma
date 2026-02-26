import { z } from "zod";

export const complaintSchema = z.object({
  // General info
  complaintNumber: z.string().trim().min(1, "Obavezno polje").max(50),
  receptionDate: z.string().min(1, "Obavezno polje"),
  customerName: z.string().trim().min(1, "Obavezno polje").max(200),
  address: z.string().trim().min(1, "Obavezno polje").max(300),
  contactPhone: z.string().trim().max(50).optional(),
  contactEmail: z.string().trim().email("Neispravan email").max(255).optional().or(z.literal("")),

  // Product categories
  categories: z.array(z.string()).optional(),
  categoryOther: z.string().trim().max(200).optional(),

  // Product info
  manufacturer: z.string().trim().max(200).optional(),
  model: z.string().trim().max(200).optional(),
  serialNumber: z.string().trim().max(100).optional(),
  purchaseDate: z.string().optional(),

  // Description
  complaintDescription: z.string().trim().min(1, "Obavezno polje").max(3000),
  serviceFindings: z.string().trim().max(3000).optional(),

  // Warranty
  proofOfPurchaseNumber: z.string().trim().max(100).optional(),

  // Signatures
  customerSignature: z.string().trim().max(100).optional(),
  customerSignatureImage: z.string().optional(),
  serviceSignature: z.string().trim().max(100).optional(),
  serviceSignatureImage: z.string().optional(),
});

export type ComplaintFormData = z.infer<typeof complaintSchema>;
