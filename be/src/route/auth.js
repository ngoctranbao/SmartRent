import { Router } from "express";
import { handleRegisterUser, handleLoginUser } from "../controllers/auth";
const SchemaValidator = require("nodejs-schema-validator");
const schemaValidatorInstance = new SchemaValidator();
import { signUpSchema, loginSchema } from "../schema/auth";

export const router = Router();

router.post(
  "/register",
  schemaValidatorInstance.validateBody(signUpSchema),
  handleRegisterUser
);

router.post(
  "/login",
  schemaValidatorInstance.validateBody(loginSchema),
  handleLoginUser
);
