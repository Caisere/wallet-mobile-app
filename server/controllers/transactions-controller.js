import { sql } from "../config/db.js";
import { createTransactionSchema } from "../validators/transaction-validators.js";

export async function getTransactionById(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    return res.status(201).json({
      message: "Success",
      data: transactions,
    });
  } catch (error) {
    console.log("error getting transaction:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function createTransaction(req, res) {
  try {
    const parsedData = createTransactionSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        message: parsedData.error.message,
      });
    }

    const { user_id, title, amount, category } = parsedData.data;

    const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category) 
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
      `;

    console.log(transaction.at(0));

    return res.status(201).json({
      message: "transaction created successfully",
      data: transaction.at(0),
    });
  } catch (error) {
    console.log("error creating transaction:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function deleteTransactionById(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    const result = await sql`
      DELETE FROM transactions 
      WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({
        message: `Transaction with id ${id} not found`,
      });
    }

    return res.status(200).json({
      message: "Successfully deleted the transaction",
    });
  } catch (error) {
    console.log("error deleting transaction:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getTransactionSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `;

    const expenseResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
    `;

    return res.status(200).json({
      message: "Success",
      data: {
        balance: balanceResult.at(0).balance,
        income: incomeResult.at(0).income,
        expense: expenseResult.at(0).expenses,
      },
    });
  } catch (error) {
    console.log("error getting transaction summary:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
