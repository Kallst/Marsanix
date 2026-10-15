import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserNotFoundError } from '../../domain/exceptions/UserNotFoundError';
import { UserDTO, toUserDTO } from '../dtos/UserDTO';

export class GetUserProfile {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<UserDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return toUserDTO(user);
  }
}