import { body } from "express-validator";

export const loginValidation = [
  body("email", "This format is not available").isEmail(),
  body("password", "This format is not available, min: 3 chars").isLength({
    min: 3,
  }),
];

export const registerValidation = [
  body("email", "This format is not available").isEmail(),
  body("password", "This format is not available, min: 3 chars").isLength({
    min: 3,
  }),
  body("fullName", "This format is not available, min: 3 chars").isLength({
    min: 3,
  }),
  body("avatarUrl").optional().isURL(),
];
