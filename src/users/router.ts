import express from "express";
import { UserController } from "./controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import getFirstLessonFromCourse from "../middleware/getFirstLessonFromCourse.js";

const userRouter = express.Router();


// userRouter.get("/:id", authMiddleware, asyncHandler(UserController.getById));
userRouter
  .get("/permission/:permission", asyncHandler(UserController.getByPermission))
  .get("/nextLevel/:id", asyncHandler(UserController.getNextLevelById))
  .get("/:id", asyncHandler(UserController.getById))
  .get("/", asyncHandler(UserController.getMany));

userRouter
  .post("/login", asyncHandler(UserController.login))
  .post("/",asyncHandler(getFirstLessonFromCourse), asyncHandler(UserController.registerUser)
  );

userRouter.put("/:id", authMiddleware, asyncHandler(UserController.updateById));

userRouter.delete(
  "/:id",
  authMiddleware,
  authMiddleware,
  asyncHandler(UserController.deleteById)
);

export default userRouter;
