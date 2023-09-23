import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const secretKey = process.env.ACCESS_TOKEN_SECRET as string;

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  const token = authHeader?.split(" ")[1] as string;

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user: any) => {
    if (err) return res.sendStatus(403);
    req.userName = user.userName;
    next();
  });
}

export default authenticateToken;
