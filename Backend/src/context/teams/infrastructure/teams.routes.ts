import { RequestHandler, Router } from 'express';
import { CreateTeamController } from './controllers/CreateTeamController';
import { AddTeamMemberController } from './controllers/AddTeamMemberController';
import { RemoveTeamMemberController } from './controllers/RemoveTeamMemberController';
import { GetTeamController } from './controllers/GetTeamController';
import { ListTeamsByUserController } from './controllers/ListTeamsByUserController';
import { TransferTeamCaptainController } from './controllers/TransferTeamCaptainController';

interface TeamsControllers {
  createTeamController: CreateTeamController;
  getTeamController: GetTeamController;
  addTeamMemberController: AddTeamMemberController;
  removeTeamMemberController: RemoveTeamMemberController;
  listTeamsByUserController: ListTeamsByUserController;
  transferTeamCaptainController: TransferTeamCaptainController;
}

export function createTeamsRouter(controllers: TeamsControllers, authenticate: RequestHandler): Router {
  const router = Router();

  router.post('/teams', authenticate, controllers.createTeamController.handle);
  router.get('/teams/:teamId', controllers.getTeamController.handle);
  router.post('/teams/:teamId/members', authenticate, controllers.addTeamMemberController.handle);
  router.delete('/teams/:teamId/members/:userId', authenticate, controllers.removeTeamMemberController.handle);
  router.put('/teams/:teamId/captain', authenticate, controllers.transferTeamCaptainController.handle);
  router.get('/users/:userId/teams', controllers.listTeamsByUserController.handle);

  return router;
}