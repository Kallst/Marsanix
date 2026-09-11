import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { pool } from './db';
import { openapiDocument } from './openapi';

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
import { createTeamsRouter } from './context/teams/infrastructure/teams.routes';

import { PostgresGameTemplateRepository } from './context/games/infrastructure/repositories/PostgresGameTemplateRepository';
import { CreateGameTemplate } from './context/games/application/use-cases/CreateGameTemplate';
import { GetGameTemplate } from './context/games/application/use-cases/GetGameTemplate';
import { ListGameTemplates } from './context/games/application/use-cases/ListGameTemplates';
import { CreateGameTemplateController } from './context/games/infrastructure/controllers/CreateGameTemplateController';
import { GetGameTemplateController } from './context/games/infrastructure/controllers/GetGameTemplateController';
import { ListGameTemplatesController } from './context/games/infrastructure/controllers/ListGameTemplatesController';
import { createGamesRouter } from './context/games/infrastructure/games.routes';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'marsanix-esports-backend' });
  });

  // --- Composition root: módulo teams ---
  const teamRepository = new PostgresTeamRepository(pool);

  const teamsRouter = createTeamsRouter({
    createTeamController: new CreateTeamController(new CreateTeam(teamRepository)),
    getTeamController: new GetTeamController(new GetTeam(teamRepository)),
    addTeamMemberController: new AddTeamMemberController(new AddTeamMember(teamRepository)),
    removeTeamMemberController: new RemoveTeamMemberController(new RemoveTeamMember(teamRepository)),
    listTeamsByUserController: new ListTeamsByUserController(new ListTeamsByUser(teamRepository)),
  });

  app.use('/api', teamsRouter);

  // --- Composition root: módulo games ---
  const gameTemplateRepository = new PostgresGameTemplateRepository(pool);

  const gamesRouter = createGamesRouter({
    createGameTemplateController: new CreateGameTemplateController(new CreateGameTemplate(gameTemplateRepository)),
    getGameTemplateController: new GetGameTemplateController(new GetGameTemplate(gameTemplateRepository)),
    listGameTemplatesController: new ListGameTemplatesController(new ListGameTemplates(gameTemplateRepository)),
  });

  app.use('/api', gamesRouter);

  return app;
}