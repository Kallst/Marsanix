import express, { Application } from 'express';
import cors from 'cors';
import { pool } from './db';

import { PostgresTeamRepository } from './context/teams/infrastructure/repositories/PostgresTeamRepository';
import { CreateTeam } from './context/teams/application/use-cases/CreateTeam';
import { AddTeamMember } from './context/teams/application/use-cases/AddTeamMember';
import { RemoveTeamMember } from './context/teams/application/use-cases/RemoveTeamMember';
import { GetTeam } from './context/teams/application/use-cases/GetTeam';
import { ListTeamsByUser } from './context/teams/application/use-cases/ListTeamsByUser';
import { CreateTeamController } from './context/teams/infrastructure/controllers/CreateTeamController';
import { AddTeamMemberController } from './context/teams/infrastructure/controllers/AddTeamMemberController';
import { RemoveTeamMemberController } from './context/teams/infrastructure/controllers/RemoveTeamMemberController';
import { GetTeamController } from './context/teams/infrastructure/controllers/GetTeamController';
import { ListTeamsByUserController } from './context/teams/infrastructure/controllers/ListTeamsByUserController';

import { PostgresGameTemplateRepository } from './context/games/infrastructure/repositories/PostgresGameTemplateRepository';
import { CreateGameTemplate } from './context/games/application/use-cases/CreateGameTemplate';
import { GetGameTemplate } from './context/games/application/use-cases/GetGameTemplate';
import { ListGameTemplates } from './context/games/application/use-cases/ListGameTemplates';
import { CreateGameTemplateController } from './context/games/infrastructure/controllers/CreateGameTemplateController';
import { GetGameTemplateController } from './context/games/infrastructure/controllers/GetGameTemplateController';
import { ListGameTemplatesController } from './context/games/infrastructure/controllers/ListGameTemplatesController';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'marsanix-esports-backend' });
  });

  // --- Composition root: módulo teams ---
  const teamRepository = new PostgresTeamRepository(pool);

  const createTeam = new CreateTeam(teamRepository);
  const addTeamMember = new AddTeamMember(teamRepository);
  const removeTeamMember = new RemoveTeamMember(teamRepository);
  const getTeam = new GetTeam(teamRepository);
  const listTeamsByUser = new ListTeamsByUser(teamRepository);

  const createTeamController = new CreateTeamController(createTeam);
  const addTeamMemberController = new AddTeamMemberController(addTeamMember);
  const removeTeamMemberController = new RemoveTeamMemberController(removeTeamMember);
  const getTeamController = new GetTeamController(getTeam);
  const listTeamsByUserController = new ListTeamsByUserController(listTeamsByUser);

  app.post('/api/teams', createTeamController.handle);
  app.get('/api/teams/:teamId', getTeamController.handle);
  app.post('/api/teams/:teamId/members', addTeamMemberController.handle);
  app.delete('/api/teams/:teamId/members/:userId', removeTeamMemberController.handle);
  app.get('/api/users/:userId/teams', listTeamsByUserController.handle);

  // --- Composition root: módulo games ---
  const gameTemplateRepository = new PostgresGameTemplateRepository(pool);

  const createGameTemplate = new CreateGameTemplate(gameTemplateRepository);
  const getGameTemplate = new GetGameTemplate(gameTemplateRepository);
  const listGameTemplates = new ListGameTemplates(gameTemplateRepository);

  const createGameTemplateController = new CreateGameTemplateController(createGameTemplate);
  const getGameTemplateController = new GetGameTemplateController(getGameTemplate);
  const listGameTemplatesController = new ListGameTemplatesController(listGameTemplates);

  app.post('/api/games', createGameTemplateController.handle);
  app.get('/api/games/:id', getGameTemplateController.handle);
  app.get('/api/games', listGameTemplatesController.handle);

  return app;
}