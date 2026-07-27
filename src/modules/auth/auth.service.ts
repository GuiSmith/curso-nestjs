import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import { SignInDTO, SignUpDTO } from './auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) {}

    async signup(data: SignUpDTO) {
        const passwordHash = await bcrypt.hash(data.password, 12);

        const isEmailInUse = await this.userService.findByEmail(data.email);

        if(isEmailInUse){
            throw new ConflictException('E-mail já cadastrado, use outro');
        }

        const user = await this.prismaService.user.create({
            data: {
                ...data,
                password: passwordHash,
            }
        });

        return {
            token: this.jwtService.sign({ sub: user.id })
        }
    }

    async signIn(data: SignInDTO) {
        const user = await this.prismaService.user.findFirst({ where: { email: data.email }});

        if(user && await bcrypt.compare(data.password, user.password)){
            return {
                token: this.jwtService.sign({
                    sub: user.id
                })
            }
        }

        throw new UnauthorizedException();
    }
}
