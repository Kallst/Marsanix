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