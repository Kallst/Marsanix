import { Router } from 'express';
import { GetUserProfileController } from './controllers/GetUserProfileController';

interface UsersControllers {
  getUserProfileController: GetUserProfileController;
}

export function createUsersRouter(controllers: UsersControllers): Router {
  const router = Router();

  router.get('/users/:userId', controllers.getUserProfileController.handle);

  return router;
}