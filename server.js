import UserModel from "./app/models/User.js";
import checkAuth from "./app/utils/check-auth.middleware.js";
import { registerValidation } from "./app/validation/auth.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
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

  /* TODO:   Auth user  */

  app.post("/login", async (req, res) => {
    try {
      /* User in baseData? */
      const user = await UserModel.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res.status(404).json({
          message: "baseData is empty, user is not found",
        });
      }

      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user._doc.passwordHash
      );

      if (!isValidPassword) {
        return res.status(404).json({
          message: "Password is not defined",
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      const { passwordHash, ...userData } = user._doc;
      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Authorization error",
      });
    }
  });

  /* TODO:   Register user  */
  app.post("/register", registerValidation, async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
      }
      /* Encryption password */
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      /* Our password + algorithm */
      const hash = await bcrypt.hash(password, salt);

      /* Document for user */
      const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash,
      });
      /* Save doc in baseData */
      const user = await doc.save();

      /* Checking token */
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      const { passwordHash, ...userData } = user._doc;
      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Registration error",
      });
    }
  });

  /* TODO: Get info about us */
  app.get("/me", checkAuth, (req, res) => {
    try {
      res.json({
        success: true,
      });
    } catch (error) {}
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
