import { CampaignStatus } from "@/types";
import {
    z
} from "zod";
const STATUSES: [CampaignStatus, ...CampaignStatus[]] = [
  "active", 
  "draft", 
  "paused", 
  "completed", 
  "cancelled"
];
export const campaignSchema = z
    .object({
         organization_id: z
            .string().optional(),
         id: z
            .string().optional(),
        name: z
            .string()
            .min(3, {
                message: "Campaign name must be at least 3 characters"
            }),
        description: z
            .string()
            .min(5, {
                message: "Description is required"
            }),
        estimated_content_count: z
            .number()
            .optional(),
        expected_budget: z
            .number()
            .positive({
                message: "Budget must be greater than 0"
            }) .optional(),
        status: z.enum(STATUSES),
        start_date: z.string().min(1, {
            message: "Start date is required"
        }),
        end_date: z.string().min(1, {
            message: "End date is required"
        }).optional(),
        target: z.string().min(1, {
            message: "Target goal is required"
        }),
    })
    .refine(
        (data) => {
            if (data.start_date && data.end_date) {
                return new Date(data.end_date) > new Date(data.start_date);
            }
            return true;
        }, {
            message: "End date must be at least one day after start date",
            path: ["end_date"],
        }
    );