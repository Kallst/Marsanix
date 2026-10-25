import { RequestHandler, Router } from 'express';
import { CreateGameTemplateController } from './controllers/CreateGameTemplateController';
import { GetGameTemplateController } from './controllers/GetGameTemplateController';
import { ListGameTemplatesController } from './controllers/ListGameTemplatesController';
import { UpdateGameTemplateController } from './controllers/UpdateGameTemplateController';

interface GamesControllers {
  createGameTemplateController: CreateGameTemplateController;
  getGameTemplateController: GetGameTemplateController;
  listGameTemplatesController: ListGameTemplatesController;
  updateGameTemplateController: UpdateGameTemplateController;
}

export function createGamesRouter(controllers: GamesControllers, authenticate: RequestHandler): Router {
  const router = Router();

  router.post('/games', authenticate, controllers.createGameTemplateController.handle);
  router.get('/games/:id', controllers.getGameTemplateController.handle);
  router.get('/games', controllers.listGameTemplatesController.handle);
  router.put('/games/:id', authenticate, controllers.updateGameTemplateController.handle);

  return router;
}