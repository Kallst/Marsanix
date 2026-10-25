import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { pool } from './db';
import { openapiDocument } from './openapi';

import { PostgresTeamRepository } from './context/teams/infrastructure/repositories/PostgresTeamRepository';
import { CreateTeam, AddTeamMember, RemoveTeamMember, GetTeam, ListTeamsByUser, TransferTeamCaptain } from './context/teams/application/use-cases/TeamUseCases';
import { CreateTeamController } from './context/teams/infrastructure/controllers/CreateTeamController';
import { AddTeamMemberController } from './context/teams/infrastructure/controllers/AddTeamMemberController';
import { RemoveTeamMemberController } from './context/teams/infrastructure/controllers/RemoveTeamMemberController';
import { GetTeamController } from './context/teams/infrastructure/controllers/GetTeamController';
import { ListTeamsByUserController } from './context/teams/infrastructure/controllers/ListTeamsByUserController';
import { TransferTeamCaptainController } from './context/teams/infrastructure/controllers/TransferTeamCaptainController';
import { createTeamsRouter } from './context/teams/infrastructure/teams.routes';

import { PostgresGameTemplateRepository } from './context/games/infrastructure/repositories/PostgresGameTemplateRepository';
import { CreateGameTemplate, GetGameTemplate, ListGameTemplates, UpdateGameTemplate } from './context/games/application/use-cases/GameUseCases';
import { CreateGameTemplateController } from './context/games/infrastructure/controllers/CreateGameTemplateController';
import { GetGameTemplateController } from './context/games/infrastructure/controllers/GetGameTemplateController';
import { ListGameTemplatesController } from './context/games/infrastructure/controllers/ListGameTemplatesController';
import { UpdateGameTemplateController } from './context/games/infrastructure/controllers/UpdateGameTemplateController';
import { createGamesRouter } from './context/games/infrastructure/games.routes';

import { PostgresUserRepository } from './context/users/infrastructure/repositories/PostgresUserRepository';
import { BcryptPasswordHasher } from './context/users/infrastructure/services/PasswordHasher';
import { JwtTokenService } from './context/users/infrastructure/services/TokenService';
import { RegisterUser } from './context/users/application/use-cases/RegisterUser';
import { LoginUser } from './context/users/application/use-cases/LoginUser';
import { GetUserProfile } from './context/users/application/use-cases/GetUserProfile';
import { UpdateUserProfile } from './context/users/application/use-cases/UpdateUserProfile';
import { RegisterUserController } from './context/users/infrastructure/controllers/RegisterUserController';
import { LoginController } from './context/users/infrastructure/controllers/LoginController';
import { GetUserProfileController } from './context/users/infrastructure/controllers/GetUserProfileController';
import { UpdateUserProfileController } from './context/users/infrastructure/controllers/UpdateUserProfileController';
import { createUsersRouter } from './context/users/infrastructure/users.routes';
import { createAuthenticate } from './context/users/infrastructure/middlewares/authMiddleware';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'marsanix-esports-backend' });
  });

  // --- Autenticación (compartida por los módulos) ---
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
  }

  const tokenService = new JwtTokenService(jwtSecret);
  const authenticate = createAuthenticate(tokenService);

  // --- Composition root: módulo teams ---
  const teamRepository = new PostgresTeamRepository(pool);

  const teamsRouter = createTeamsRouter({
    createTeamController: new CreateTeamController(new CreateTeam(teamRepository)),
    getTeamController: new GetTeamController(new GetTeam(teamRepository)),
    addTeamMemberController: new AddTeamMemberController(new AddTeamMember(teamRepository)),
    removeTeamMemberController: new RemoveTeamMemberController(new RemoveTeamMember(teamRepository)),
    listTeamsByUserController: new ListTeamsByUserController(new ListTeamsByUser(teamRepository)),
    transferTeamCaptainController: new TransferTeamCaptainController(new TransferTeamCaptain(teamRepository)),
  }, authenticate);

  app.use('/api', teamsRouter);

  // --- Composition root: módulo games ---
  const gameTemplateRepository = new PostgresGameTemplateRepository(pool);

  const gamesRouter = createGamesRouter({
    createGameTemplateController: new CreateGameTemplateController(new CreateGameTemplate(gameTemplateRepository)),
    getGameTemplateController: new GetGameTemplateController(new GetGameTemplate(gameTemplateRepository)),
    listGameTemplatesController: new ListGameTemplatesController(new ListGameTemplates(gameTemplateRepository)),
    updateGameTemplateController: new UpdateGameTemplateController(new UpdateGameTemplate(gameTemplateRepository)),
  }, authenticate);

  app.use('/api', gamesRouter);

  // --- Composition root: módulo users ---
  const userRepository = new PostgresUserRepository(pool);
  const passwordHasher = new BcryptPasswordHasher();

  const usersRouter = createUsersRouter({
    registerUserController: new RegisterUserController(new RegisterUser(userRepository, passwordHasher)),
    loginController: new LoginController(new LoginUser(userRepository, passwordHasher, tokenService)),
    getUserProfileController: new GetUserProfileController(new GetUserProfile(userRepository)),
    updateUserProfileController: new UpdateUserProfileController(new UpdateUserProfile(userRepository)),
  }, authenticate);

  app.use('/api', usersRouter);

  return app;
}