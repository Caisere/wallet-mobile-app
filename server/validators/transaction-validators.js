import { z } from "zod";

export const createTransactionSchema = z
  .object({
    user_id: z.string().min(1, "user_id is required"),
    title: z.string().min(1, "title is required"),
    amount: z.coerce.number().int("amount must be an integer"),
    category: z.enum(["Income", "Expense"], {
      error: () => {
        message: "category must be one of: Income or Expense";
      },
    }),
  })
  .superRefine(({ amount, category }, ctx) => {
    if (category === "Income" && amount <= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message: "Income amount must be > 0",
      });
    }
    if (category === "Expense" && amount >= 0) {
      ctx.addIssue({
        code: "custom",
        path: ["amount"],
        message: "Expense amount must be < 0",
      });
    }
  });
