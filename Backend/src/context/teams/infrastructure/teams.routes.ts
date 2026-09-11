import { Router } from 'express';
import { CreateTeamController } from './controllers/CreateTeamController';
import { AddTeamMemberController } from './controllers/AddTeamMemberController';
import { RemoveTeamMemberController } from './controllers/RemoveTeamMemberController';
import { GetTeamController } from './controllers/GetTeamController';
import { ListTeamsByUserController } from './controllers/ListTeamsByUserController';

interface TeamsControllers {
  createTeamController: CreateTeamController;
  getTeamController: GetTeamController;
  addTeamMemberController: AddTeamMemberController;
  removeTeamMemberController: RemoveTeamMemberController;
  listTeamsByUserController: ListTeamsByUserController;
}

export function createTeamsRouter(controllers: TeamsControllers): Router {
  const router = Router();

  router.post('/teams', controllers.createTeamController.handle);
  router.get('/teams/:teamId', controllers.getTeamController.handle);
  router.post('/teams/:teamId/members', controllers.addTeamMemberController.handle);
  router.delete('/teams/:teamId/members/:userId', controllers.removeTeamMemberController.handle);
  router.get('/users/:userId/teams', controllers.listTeamsByUserController.handle);

  return router;
}