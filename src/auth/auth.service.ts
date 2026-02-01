import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import type { IHashAdapter } from '../common/interfaces/hash-adapter.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { responseConfig } from '../common/global/response.config';
import { LoginDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @Inject('IHashAdapter') private readonly bcryptAdapter: IHashAdapter,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const userToCreate = { ...createAuthDto };

    try {
      userToCreate.password = await this.bcryptAdapter.hash(
        userToCreate.password,
      );

      const newUser = this.userRepository.create(userToCreate);

      await this.userRepository.save(newUser);

      return responseConfig(
        { id: newUser.user_id },
        'User created successfully',
      );
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginDto: LoginDTO) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
        is_active: true,
      },
      select: {
        user_id: true,
        name: true,
        lastName: true,
        email: true,
        password: true,
        roles: true,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    if (!(await this.bcryptAdapter.compare(loginDto.password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    const accessToken = await this.jwtService.signAsync({
      user: userWithoutPassword,
    });
    return responseConfig({ token: accessToken }, 'Logged in');
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  // return updateAuthDto;
  // }

  private handleExceptions(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.detail,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23502') {
      throw new BadRequestException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.detail,
      );
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error: check server logs',
    );
  }
}
