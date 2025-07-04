import { Controller, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';

@Controller()
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}
  
  @MessagePattern('auth_signup')
  async signup(data: { email: string; password: string }) {
    return this.authService.signup(data.email, data.password);
  }
  
  @MessagePattern('auth_login')
  async login(data: { email: string; password: string }) {
    return this.authService.login(data.email, data.password);
  }
  
  @MessagePattern('auth_reset_password')
  async resetPassword(data: { email: string; newPassword: string }) {
    return this.authService.resetPassword(data.email, data.newPassword);
  }
  
  @MessagePattern('auth_profile')
  async getProfile(data: { accessToken: string }) {
    // req.user is set by JwtStrategy
    if (!data.accessToken) throw new UnauthorizedException('Invalid or expired token');
    // Optionally fetch more user details from DB
    return this.authService.getProfile(data.accessToken);
  }  
}
