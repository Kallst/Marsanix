import { User } from '../../domain/entities/User';
import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserPassword } from '../../domain/value-objects/UserPassword';
import { UserRepository, PasswordHasher } from '../../domain/repositories/UserRepository';
import { UserAlreadyExistsError } from '../../domain/exceptions/UserAlreadyExistsError';
import { RegisterUserDTO } from '../dtos/RegisterUserDTO';
import { UserDTO, toUserDTO } from '../dtos/UserDTO';

export class RegisterUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(data: RegisterUserDTO): Promise<UserDTO> {
    const email = new UserEmail(data.email);
    const password = new UserPassword(data.password);

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new UserAlreadyExistsError(email.toString());
    }

    const passwordHash = await this.passwordHasher.hash(password.toString());
    const user = new User(crypto.randomUUID(), data.name, email, passwordHash);
    await this.userRepository.save(user);
    return toUserDTO(user);
  }
}