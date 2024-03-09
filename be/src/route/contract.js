import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { cancelContractSchema, initContractSchema } from "../schema/contract";
import {
  handleCloseContract,
  handleGetContractForMe,
  handleInitContract,
} from "../controllers/contract";
const SchemaValidator = require("nodejs-schema-validator");
const schemaValidatorInstance = new SchemaValidator();

export const router = Router();

router.post(
  "/",
  authenticate,
  schemaValidatorInstance.validateBody(initContractSchema),
  handleInitContract
);

router.post(
  "/close",
  authenticate,
  schemaValidatorInstance.validateBody(cancelContractSchema),
  handleCloseContract
);

router.get("/me", authenticate, handleGetContractForMe);
