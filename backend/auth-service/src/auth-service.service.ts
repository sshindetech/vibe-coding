import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) throw new Error('User already exists');
    const hash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hash });
    await this.userRepository.save(user);
    return { message: 'Signup successful' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    // JWT access and refresh tokens
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new Error('User not found');
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return { message: 'Password reset successful' };
  }

  async getProfile(accessToken: string) {
    if (!accessToken) throw new Error('Invalid or expired token');
    const payload = this.jwtService.verify(accessToken);
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) throw new Error('User not found');
    return { userId: user.id, email: user.email };
  }

}
