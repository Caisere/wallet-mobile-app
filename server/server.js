import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import transactionRoutes from "./routes/transactions-route.js";

dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT;

if (!PORT) {
  console.log("No port found");
}

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    console.log(
      "Database initialized successfully and transaction table created 😘😘",
    );
  } catch (error) {
    console.log("error initializing and creating transaction table", error);
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.send("Running");
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
