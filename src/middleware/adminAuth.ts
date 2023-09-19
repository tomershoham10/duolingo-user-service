import { Request, Response, NextFunction } from "express";
import UserRepository from "../users/repository.js";
import { Permission } from "../users/model.js";

async function adminAuth(req: Request, res: Response, next: NextFunction) {
  const userName = req.userName;
  const user = await UserRepository.findUserByName(userName);
  console.log(user?.permission);
  if (user?.permission !== Permission.ADMIN) return res.sendStatus(403);
  next();
}

export default adminAuth;
