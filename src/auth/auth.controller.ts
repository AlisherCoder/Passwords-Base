import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ActivateDto,
  CreateAuthDto,
  LoginDto,
  OtpDto,
} from './dto/create-auth.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RefreshGuard } from 'src/guards/refresh.guard';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  login(@Body() data: LoginDto, @Req() req: Request) {
    return this.authService.login(data, req);
  }

  @Post('activate')
  activate(@Body() data: ActivateDto) {
    return this.authService.activate(data);
  }

  @Post('send-otp')
  sendOTP(@Body() data: OtpDto) {
    return this.authService.sendOTP(data);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
      },
    },
  })
  @UseGuards(RefreshGuard)
  @Post('refresh')
  refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }
}
