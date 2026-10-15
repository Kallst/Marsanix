import { UserDTO } from './UserDTO';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResultDTO {
  token: string;
  user: UserDTO;
}