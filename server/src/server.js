import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import transactionRoutes from "./routes/transactions-route.js";
import rateLimiter from "./middleware/rate-limiter.js";

dotenv.config();

const app = express();

//middleware
app.use(rateLimiter);
app.use(express.json());
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT;

if (!PORT) {
  console.log("No port found");
}

app.get("/", (req, res) => {
  res.send("Running");
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
