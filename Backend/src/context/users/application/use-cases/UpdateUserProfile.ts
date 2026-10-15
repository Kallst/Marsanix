import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserNotFoundError } from '../../domain/exceptions/UserNotFoundError';
import { UserDTO, UpdateUserProfileDTO, toUserDTO } from '../dtos/UserDTO';

export class UpdateUserProfile {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, data: UpdateUserProfileDTO): Promise<UserDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const updatedUser = user.changeName(data.name);
    await this.userRepository.save(updatedUser);
    return toUserDTO(updatedUser);
  }
}