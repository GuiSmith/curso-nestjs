import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import { SignUpDTO } from './auth.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) {}

    async signup(data: SignUpDTO) {

    }
}
