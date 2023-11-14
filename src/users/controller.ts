import Express from "express";
import axios from "axios";

import User from "./model.js";
import UserManager from "./manager.js";
import { NotFoundError } from "../exceptions/notFoundError.js";

export class UserController {
  static async registerUser(req: Express.Request, res: Express.Response) {
    try {
      const body: UserType = req.body;
      console.log("UserController create", body);

      const userName = body.userName;
      let tId: string | null = null;
      if (body.tId) {
        tId = body.tId;
      }
      const permission = body.permission;
      const password = body.password;

      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        return res.status(409).json({ error: "User already existed!" });
      } else {
        const user: UserType | undefined = await UserManager.registerUser(
          userName,
          tId,
          password,
          permission
        );
        return res.json(user);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getMany(req: Express.Request, res: Express.Response) {
    try {
      const users: UserType[] = await UserManager.findAllUsers();
      console.log("getMany", users);

      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: "Internal Server Error" });
    }
  }

  static async getById(req: Express.Request, res: Express.Response) {
    try {
      const id: string = req.params.id;
      console.log("getbyid controller id", id);
      if (id === undefined) {
        new NotFoundError("ID is undefined");
      } else {
        const user: UserType | null = await UserManager.findUserById(id);
        !user
          ? new NotFoundError(`User with ID ${req.params.id} not found.`)
          : res.status(200).json(user);
      }
    } catch (e) {
      res
        .status(500)
        .json({ error: `Error getting the user with ID: ${req.params.id}.` });
    }
  }

  static async getNextLevelById(req: Express.Request, res: Express.Response) {
    try {
      const userId: string = req.params.id;
      console.log("getNextLevelById controller id", userId);
      if (userId === undefined) {
        new NotFoundError("userId is undefined");
      } else {
        const nextLevelId: string | null = await UserManager.getNextLevelById(userId);
        !nextLevelId
          ? res.status(400).json("level not found.")
          : res.status(200).json(nextLevelId);
      }
    } catch (e) {
      console.error(e);
      res
        .status(500)
        .json({ error: `Error getting the next level with ID: ${req.params.id}.` });
    }
  }

  static async getByPermission(req: Express.Request, res: Express.Response) {
    try {
      console.log("check1");
      // console.log("controller getByPermission req.params", req.params, req.params.permission);
      const permission: Permission | undefined = req.params.permission as Permission | undefined;
      if (permission === undefined) {
        console.log("check2");

        new NotFoundError("permission is undefined");
      } else {
        console.log("controller getByPermission", permission);
        const users: UserType[] | null = await UserManager.getUserByPermission(permission);
        users ? res.status(200).json(users)
          : new NotFoundError(`getByPermission not found.`)

      }
    } catch (e) {
      res
        .status(500)
        .json({ error: "server error" });
    }
  }

  static async updateById(req: Express.Request, res: Express.Response) {
    try {
      const id: string = req.params.id;
      const body: Partial<UserType> = req.body;
      console.log("controller - update user, req.params", req.params);

      const user = await UserManager.updateUser(id, body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Error while updating the user." });
    }
  }

  static async deleteById(req: Express.Request, res: Express.Response) {
    try {
      const id: string = req.params.id;
      const status = await UserManager.deleteUser(id);
      res.json(status);
    } catch (err) {
      res.status(500).json({ error: "Error while deleting the user." });
    }
  }

  static async login(req: Express.Request, res: Express.Response) {
    try {
      const userName: string = req.body.userName;
      const password: string = req.body.password;
      console.log("user-controller login username", { userName, password });
      const user = await UserManager.login(userName, password);
      if (user) {
        const userId = user.id;
        console.log("user-controller response from user-service", userId);

        if (userId) {
          const role = await UserManager.roleCheck(user.userName);

          const responseToken = await axios.post(
            "http://authentication-service:4000/api/auth/tokens-generate",
            {
              userName: user.userName,
              userId: user.id,
              nextLessonId: user.nextLessonId,
              role: role
            }
          );
          const token = responseToken.data.token;
          console.log("user-controller response from auth-service", token);
          res.header("Authorization", `Bearer ${token}`);

          res.status(200).json({ message: "Authentication successful" });
        } else {
          res
            .status(401)
            .json({
              message: "Authentication failed. Invalid username or password.",
            });
        }
      }
    } catch (error) {
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "ECONNREFUSED") {
          console.error(
            "Connection to the server was refused. Please check if the server is running."
          );
        } else {
          console.error("An error occurred:", error);
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  }
}
