import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoginUserDto, CreateUserDto } from './dto/';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

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

  @Get('private')
  @UseGuards(AuthGuard())
  testinPrivateRoute() {
    return 'This is a private route';
  }
}
