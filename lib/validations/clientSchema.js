import { z } from "zod";

export const clientSchema = z.object({
  // حقول مطلوبة
  name: z.string().min(1, "Client name is required"),
  phone: z.string().min(1, "Phone number is required"),
  type: z.string().min(1, "Client type is required"),
  city_id: z.string().min(1, "Please select a city"),
  industry_id: z.string().min(1, "Please select an industry"),

  // حقول اختيارية (تقبل نص فارغ "")
  email: z
    .string()
    .email("Invalid email address")
    .or(z.literal(""))
    .optional(),
  
  whatsapp: z.string().optional(),
  
  website: z
    .string()
    .url("Invalid website URL")
    .or(z.literal(""))
    .optional(),
    
  address: z.string().optional(),
  notes: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
});