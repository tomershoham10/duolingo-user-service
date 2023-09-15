import express from "express";
import { UserController } from "./controller.js";

const userRouter = express.Router();

userRouter.get("/", UserController.getMany);

userRouter.get("/:id", UserController.getById);

userRouter.get("/:permission", UserController.getByPermission);

userRouter.post("/", UserController.create);

userRouter.post("/validate/", UserController.validateUser);

userRouter.put("/:id", UserController.updateById);

userRouter.delete("/:id", UserController.deleteById);

export default userRouter;
