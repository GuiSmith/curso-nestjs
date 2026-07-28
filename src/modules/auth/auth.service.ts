import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt'
import { ForgotPasswordResponseDTO, SignInDTO, SignUpDTO, TokenResponseDTO } from './auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { UserListFullItemDTO } from '../users/users.dto';
import { PURPOSE_REQUESTS_KEY, PURPOSE_RESET_PASSWORD_KEY } from 'src/consts';

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

        const user = await this.userService.create(data);

        return {
            token: this.jwtService.sign({
                sub: user.id,
                purpose: PURPOSE_REQUESTS_KEY,
            })
        }
    }

    async signIn(data: SignInDTO): Promise<TokenResponseDTO> {
        const user = await this.userService.findByEmail(data.email);

        if(await bcrypt.compare(data.password, user.password)){
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

    async resetPassword (token: string, newPassword: string): Promise<UserListFullItemDTO> {
        const payload = this.jwtService.verify(token);

        if(payload.purpose !== PURPOSE_RESET_PASSWORD_KEY){
            throw new BadRequestException(`Invalid token purpose: ${payload.purpose}`);
        }

        const updatedUser = await this.userService.updatePassword(payload.sub, newPassword);

        return updatedUser;
    }
}
