import { Router } from 'express';
import { CreateGameTemplateController } from './controllers/CreateGameTemplateController';
import { GetGameTemplateController } from './controllers/GetGameTemplateController';
import { ListGameTemplatesController } from './controllers/ListGameTemplatesController';

interface GamesControllers {
  createGameTemplateController: CreateGameTemplateController;
  getGameTemplateController: GetGameTemplateController;
  listGameTemplatesController: ListGameTemplatesController;
}

export function createGamesRouter(controllers: GamesControllers): Router {
  const router = Router();

  router.post('/games', controllers.createGameTemplateController.handle);
  router.get('/games/:id', controllers.getGameTemplateController.handle);
  router.get('/games', controllers.listGameTemplatesController.handle);

  return router;
}