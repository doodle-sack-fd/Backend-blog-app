import { registerValidation } from "./app/validation/auth.js";
import dotenv from "dotenv";
import express from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

dotenv.config();

mongoose
  .connect(process.env.BASE_URL)
  .then(() => console.log("ok"))
  .catch((error) => console.log("not ok", error));

const app = express();

app.use(express.json());

async function main() {
  app.get("/", (req, res) => {
    res.send("Hi");
  });

  app.post("/register", registerValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    res.json({
      success: true,
    });
  });

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`🚀 Server running in mode on port ${PORT}`);
  });
}

main();
