import {
    z
} from "zod";

export const campaignSchema = z
    .object({
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
        estimated_content_count: z.coerce
            .number({
                invalid_type_error: "Must be a valid number"
            })
            .min(1, {
                message: "Content count must be at least 1"
            }),
        expected_budget: z.coerce
            .number({
                invalid_type_error: "Must be a valid number"
            })
            .positive({
                message: "Budget must be greater than 0"
            }),
        status: z.enum(["active", "draft", "paused", "completed", "cancelled"], {
            errorMap: () => ({
                message: "Invalid status selected"
            }),
        }),
        start_date: z.string().min(1, {
            message: "Start date is required"
        }),
        end_date: z.string().min(1, {
            message: "End date is required"
        }),
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