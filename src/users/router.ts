import express from "express";
import { UserController } from "./controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.get(
  "/",
  authMiddleware,
  adminAuth,
  asyncHandler(UserController.getMany)
);

userRouter.get("/:id", authMiddleware, asyncHandler(UserController.getById));

userRouter.post(
  "/",
  authMiddleware,
  authMiddleware,
  asyncHandler(UserController.registerUser)
);

userRouter.post("/login/", asyncHandler(UserController.login));

userRouter.put("/:id", authMiddleware, asyncHandler(UserController.updateById));

userRouter.delete(
  "/:id",
  authMiddleware,
  authMiddleware,
  asyncHandler(UserController.deleteById)
);

export default userRouter;
