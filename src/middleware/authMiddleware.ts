import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// const secretKey = process.env.ACCESS_TOKEN_SECRET as string;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function authenticateToken(req: Request, _res: Response, _next: NextFunction) {
  console.log('auth middleware');
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1] as string;
  console.log('auth middlewear token', token);

  // if (token === null) return res.sendStatus(401);

  console.log('false verify', jwt.verify(token, 'secretKey'));

  // jwt.verify(token, secretKey, (err, user: any) => {
  //   console.log("verifing...")

  //   if (err) return res.sendStatus(403);
  //   console.log("jwt verified.")
  //   req.userName = user.userName;
  //   next();
  // });
}

export default authenticateToken;
