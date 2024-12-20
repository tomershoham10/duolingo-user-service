import { Router } from 'express';
import { UserController } from './controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const userRouter = Router();

// userRouter.get("/:id", authMiddleware, asyncHandler(UserController.getById));
userRouter
  .get(
    '/getUsersByCourseId/:courseId',
    asyncHandler(UserController.getUsersByCourseId)
  )
  .get('/getNextLessonId/:id', asyncHandler(UserController.getNextLessonById))
  .get('/:id', asyncHandler(UserController.getById))
  .get('/', asyncHandler(UserController.getMany));

userRouter
  .post('/login', asyncHandler(UserController.login))
  .post('/', asyncHandler(UserController.registerUser)); //fix this function! add getNextLessonId

userRouter
  .put(
    '/updateNextLessonId/:userId',
    asyncHandler(UserController.updateNextLessonId)
  )
  // .put("/updateNextLessonId/:id", async (req, res, next) => {
  //   console.log("1");
  //   const user = await UserController.getById(req, res);
  //   req.body.user = user;
  //   console.log("2", user, req.body);
  //   // next();
  // }, async (req, res, next) => {
  //   console.log("3", req.body, res);
  //   await getNextLessonId(req, res, next);
  // })
  // asyncHandler(UserController.getById),
  // asyncHandler(getNextLessonId),
  // asyncHandler(UserController.updateById))
  .put('/:id', asyncHandler(UserController.updateById));

userRouter.delete(
  '/:id',
  authMiddleware,
  authMiddleware,
  asyncHandler(UserController.deleteById)
);

export default userRouter;
