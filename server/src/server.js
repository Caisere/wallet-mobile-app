import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import transactionRoutes from "./routes/transactions-route.js";
import rateLimiter from "./middleware/rate-limiter.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Running");
});

//middleware
app.use(rateLimiter);
app.use(express.json());
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 3000;

if (!PORT) {
  console.log("No port found");
}

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on PORT:", PORT);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
