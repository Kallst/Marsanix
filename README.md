CREATE DATABASE marsanix_esports;

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE team_members (
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, user_id)
);


AÑADIR IMPORTANTE ________-----_____


CREATE TABLE game_templates (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  team_size INTEGER NOT NULL CHECK (team_size > 0)
);

AGREGAR/ INSTALAR (dentro de backend):

npm install bcrypt jsonwebtoken
npm install -D @types/bcrypt @types/jsonwebtoken

REALIZAR CAMBIOS EN LA BASE DE DATOS:

ALTER TABLE teams ADD COLUMN captain_id UUID REFERENCES users(id);

UPDATE teams t
SET captain_id = (SELECT tm.user_id FROM team_members tm WHERE tm.team_id = t.id LIMIT 1)
WHERE captain_id IS NULL;

DELETE FROM teams WHERE captain_id IS NULL;

ALTER TABLE teams ALTER COLUMN captain_id SET NOT NULL;