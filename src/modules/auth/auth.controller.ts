import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SignUpDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ){}

    @Post()
    signup(@Body() data: SignUpDTO) {
        return this.authService.signup(data);
    }
}
