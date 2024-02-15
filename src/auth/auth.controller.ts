import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoginUserDto, CreateUserDto } from './dto/';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { GetUser, RawHeaders, RoleProtected, Auth } from './decorators/';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.create(createUserDto);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<User> {
    return await this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  async checkAuthStatus(@GetUser() user: User) {
    return await this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  privateRoute(
    @Req() req: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: User,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      user,
      ok: true,
      message: 'You have access to this route',
      userEmail,
      rawHeaders,
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.ADMIN)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      user,
      ok: true,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.ADMIN)
  privateRoute3(@GetUser() user: User) {
    return {
      user,
      ok: true,
    };
  }
}
