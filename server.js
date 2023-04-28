import { getMe, login, register } from "./app/controllers/User.controller.js";
import {
  createPost,
  getAllPosts,
  getOnePost,
} from "./app/controllers/post.controller.js";
import checkAuth from "./app/utils/check-auth.middleware.js";
import { loginValidation, registerValidation } from "./app/validations/auth.js";
import { PostCreateValidation } from "./app/validations/post.js";
import dotenv from "dotenv";
import express from "express";
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

  app.post("/login", loginValidation, login);

  /* TODO:   Register user  */
  app.post("/register", registerValidation, register);

  /* TODO: Get info about us */
  app.get("/me", checkAuth, getMe);

  /* TODO: CreatePost */
  app.post("/posts", checkAuth, PostCreateValidation, createPost);

  /* TODO: GetAllPosts */
  app.get("/posts", getAllPosts);

  /* TODO: GetOnePost */
  app.get("/posts/:id", getOnePost);
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(`🚀 Server running in mode on port ${PORT}`);
  });
}

main();
