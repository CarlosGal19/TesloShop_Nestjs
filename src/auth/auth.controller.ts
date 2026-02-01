import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  // Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDTO } from './dto/login.dto';
// import { GetUser } from './decorators/get-user.decorator';
// import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from './guards/user-role.guard';
import { UserRole } from './decorators/user-role.decorator';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }

  // @Get('test')
  // @UseGuards(AuthGuard())
  // testingAuth(@GetUser('email') user: User) {
  //   console.log(user);
  //   return {
  //     message: 'Hello',
  //   };
  // }

  @Get('test2')
  @UserRole(ValidRoles.admin, ValidRoles.user) // Add roles to metadata
  @UseGuards(AuthGuard(), UserRoleGuard) // Set user to request and validates user's roles (Auth guard is authentication and User Role guard is authorization)
  testingGuard() {
    return {
      message: 'Hello',
    };
  }

  @Get('test3')
  @Auth(ValidRoles.admin) // Auth decorator isolates logic of both decorators (UserRole decorator and guards)
  testingDecoratorComposition() {
    return {
      message: 'Hello',
    };
  }

  @Get('auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }
}
