import { User } from '../../domain/entities/User';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export interface UpdateUserProfileDTO {
  name: string;
}

export function toUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email.toString(),
  };
}