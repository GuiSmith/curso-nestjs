import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import { ForgotPasswordResponseDTO, SignInDTO, SignUpDTO, TokenResponseDTO } from './auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { toSafeUser } from 'src/common/mappers/toSafeUser.mapper';
import { AuthenticatedUserDTO } from '../users/users.dto';

export const PURPOSE_REQUESTS_KEY = "requests";
export const PURPOSE_RESET_PASSWORD_KEY = "password-reset";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
    ) {}

    private async getHashedPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    async signup(data: SignUpDTO): Promise<TokenResponseDTO> {
        const passwordHash = await this.getHashedPassword(data.password);

        const isEmailAvailable = await this.userService.isEmailAvailable(data.email);

        if(!isEmailAvailable){
            throw new ConflictException('E-mail already registered or unavailable. Use another one');
        }

        const user = await this.prismaService.user.create({
            data: {
                ...data,
                password: passwordHash,
            }
        });

        return {
            token: this.jwtService.sign({
                sub: user.id,
                purpose: PURPOSE_REQUESTS_KEY,
            })
        }
    }

    async signIn(data: SignInDTO): Promise<TokenResponseDTO> {
        const user = await this.prismaService.user.findFirst({ where: { email: data.email }});

        if(user && await bcrypt.compare(data.password, user.password)){
            return {
                token: this.jwtService.sign({
                    sub: user.id,
                    purpose: PURPOSE_REQUESTS_KEY,
                })
            }
        }

        throw new UnauthorizedException();
    }

    async forgotPassword(email: string): Promise<ForgotPasswordResponseDTO> {
        const user = await this.userService.findByEmail(email);

        if(!user){
            throw new NotFoundException('User not found');
        }

        const token = this.jwtService.sign({
            sub: user.email,
            email: user.email,
            purpose: PURPOSE_RESET_PASSWORD_KEY
        });

        await this.mailService.sendPasswordRequest(user.email, token);

        return { message: 'Password request email sent' };

    }

    async resetPassword (token: string, newPassword: string): Promise<AuthenticatedUserDTO> {
        const payload = this.jwtService.verify(token);

        if(payload.purpose !== PURPOSE_RESET_PASSWORD_KEY){
            throw new BadRequestException(`Invalid token purpose: ${payload.purpose}`);
        }

        const user = await this.userService.findByEmail(payload.sub);

        const hashedPassword = await this.getHashedPassword(newPassword);

        const updatedUser = await this.prismaService.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return toSafeUser(updatedUser);
    }
}
