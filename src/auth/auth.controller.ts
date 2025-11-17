import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signIn(@Body() data: any) {
    try {
      const { username, password } = data;
      return this.authService.signIn({ username, password });
    } catch {
      throw BadRequestException;
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
