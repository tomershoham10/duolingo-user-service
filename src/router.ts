import { Request, Response, Router } from 'express';
import userRouter from './users/router.js';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  console.log('health');
  res.status(200).send('Alive');
});

router.use('/api/users/', userRouter);

export default router;
