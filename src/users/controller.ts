import Express from "express";
import { Permission, UserType } from "./model.js";
import UserManager from "./manager.js";

export class UserController {
  static async create(req: Express.Request, res: Express.Response) {
    try {
      const body: UserType = req.body;
      console.log(body);
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

  static async getMany(_req: Express.Request, res: Express.Response) {
    try {
      const users: UserType[] = await UserManager.findAllUsers();
      console.log("getMany");
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
      console.log("req", id);
      if (id === undefined) {
        console.log("not found");
      } else {
        const user: UserType | null = await UserManager.findUserById(id);
        console.log("user", user);
        !user ? console.log("not found") : res.json(user);
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async getByPermission(req: Express.Request, res: Express.Response) {
    try {
      const rawPermission: unknown = req.query.userName;
      console.log(rawPermission);
      if (typeof rawPermission !== "string") {
        // Handle the case when userName is not a valid string
        console.log("Invalid userName");
        return;
      }

      const permission: Permission = rawPermission as Permission;
      const users: UserType[] | null = await UserManager.findUserByPermission(
        permission
      );

      if (!users) {
        console.log("Users not found");
      } else {
        res.json(users);
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async updateById(req: Express.Request, res: Express.Response) {
    try {
      const id: string = req.params.id;
      const body: Partial<UserType> = req.body;
      const user = await UserManager.updateUser(id, body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteById(req: Express.Request, res: Express.Response) {
    try {
      const id: string = req.params.id;
      const status = await UserManager.deleteUser(id);
      res.json(status);
    } catch (err) {
      console.log(err);
    }
  }

  static async validateUser(req: Express.Request, res: Express.Response) {
    try {
      console.log(req.body);
      const userName: string = req.body.userName;
      const password: string = req.body.password;
      const user = await UserManager.validateUserCredentials(
        userName,
        password
      );
      res.json(user);
    } catch (err) {
      console.log(err);
    }
  }
}
