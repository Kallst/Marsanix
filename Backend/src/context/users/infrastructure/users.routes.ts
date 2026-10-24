import { Router } from 'express';
import { RegisterUserController } from './controllers/RegisterUserController';
import { LoginController } from './controllers/LoginController';
import { GetUserProfileController } from './controllers/GetUserProfileController';

interface UsersControllers {
  registerUserController: RegisterUserController;
  loginController: LoginController;
  getUserProfileController: GetUserProfileController;
}

export function createUsersRouter(controllers: UsersControllers): Router {
  const router = Router();

  router.post('/users/register', controllers.registerUserController.handle);
  router.post('/users/login', controllers.loginController.handle);
  router.get('/users/:userId', controllers.getUserProfileController.handle);

  return router;
}