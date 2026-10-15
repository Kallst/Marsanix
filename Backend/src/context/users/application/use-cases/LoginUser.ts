import { UserEmail } from '../../domain/value-objects/UserEmail';
import { UserRepository, PasswordHasher, TokenService } from '../../domain/repositories/UserRepository';
import { InvalidCredentialsError } from '../../domain/exceptions/InvalidCredentialsError';
import { LoginDTO, LoginResultDTO } from '../dtos/LoginDTO';
import { toUserDTO } from '../dtos/UserDTO';

export class LoginUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(data: LoginDTO): Promise<LoginResultDTO> {
    const user = await this.userRepository.findByEmail(new UserEmail(data.email));
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(data.password, user.passwordHash);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return { token: this.tokenService.generate(user.id), user: toUserDTO(user) };
  }
}