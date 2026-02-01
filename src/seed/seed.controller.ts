import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.admin)
  runSeed(@GetUser() user: User) {
    return this.seedService.runSeed(user);
  }
}
