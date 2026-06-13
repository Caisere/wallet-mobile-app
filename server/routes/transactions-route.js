import express from "express";
import {
  createTransaction,
  deleteTransactionById,
  getTransactionById,
  getTransactionSummaryByUserId,
} from "../controllers/transactions-controller.js";

const router = express.Router();

router.get("/:userId", getTransactionById);
router.get("/summary/:userId", getTransactionSummaryByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransactionById);

export default router;
