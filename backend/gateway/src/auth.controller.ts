import { Controller, Post, Body, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    @Inject('CLIENT_AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'admin@admin.com' },
        password: { type: 'password' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'Signup successful' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  async signup(@Body() body: { email: string; password: string }) {
    this.logger.log('Signup endpoint called');
    return this.authService.send('auth_signup', body).toPromise();
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@admin.com' },
        password: { type: 'string', example: 'password', format: 'password' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  async login(@Body() body: { email: string; password: string }) {
    this.logger.log('Login endpoint called');
    return this.authService.send('auth_login', body).toPromise();
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'admin@admin.com' },
        password: { type: 'string', example: 'password', format: 'password' },
      },
      required: ['email', 'newPassword'],
    },
  })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'User not found' })
  async resetPassword(@Body() body: { email: string; newPassword: string }) {
    this.logger.log('Reset password endpoint called');
    return this.authService.send('auth_reset_password', body).toPromise();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get profile of logged in user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User profile returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No token provided');
    const token = authHeader.replace('Bearer ', '');
    try {
      // Optionally verify token here, or just forward to microservice
      return await this.authService.send('auth_profile', { accessToken: token }).toPromise();
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
