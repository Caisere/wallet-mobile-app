import { z } from "zod";

export const createTransactionSchema = z.object({
  user_id: z.string().min(1, "user_id is required"),
  title: z.string().min(1, "title is required"),
  amount: z.coerce.number().int("amount must be an integer"),
  category: z.enum(["Income", "Expense"], {
    error: () => {
      message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED";
    },
  }),
});
