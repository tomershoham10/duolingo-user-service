import Express from "express";
import { UserType } from "./model.js";
import UserManager from "./manager.js";
import { NotFoundError } from "../exceptions/notFoundError.js";

export class UserController {
  static async registerUser(req: Express.Request, res: Express.Response) {
    try {
      const body: UserType = req.body;
      // console.log("UserController create", req.method);

      const userName = body.userName;
      const permission = body.permission;
      const password = body.password;
      const user: UserType = await UserManager.registerUser(
        userName,
        permission,
        password
      );
      res.json(user);
    } catch (err) {
      console.log(err);
    }
  }

  static async getMany(req: Express.Request, res: Express.Response) {
    try {
      console.log("getMany", req.userName);
      const users: UserType[] = await UserManager.findAllUsers();
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: "Internal Server Error" });
    }
  }

  static async getById(req: Express.Request, res: Express.Response) {
    try {
      // console.log("get");
      const id: string | undefined = req.query.id as string | undefined;
      if (id === undefined) {
        new NotFoundError("ID is undefined");
      } else {
        const user: UserType | null = await UserManager.findUserById(id);
        !user
          ? new NotFoundError(`User with ID ${req.query.id} not found.`)
          : res.status(200).json(user);
      }
    } catch (e) {
      res
        .status(500)
        .json({ error: `Error getting the user with ID: ${req.query.id}.` });
    }
  }

  static async updateById(req: Express.Request, res: Express.Response) {
    try {
      const id: string = req.params.id;
      const body: Partial<UserType> = req.body;
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
      console.log("controller login", { userName, password });
      const accessToken = await UserManager.login(userName, password);
      res.json({ accessToken: accessToken });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
