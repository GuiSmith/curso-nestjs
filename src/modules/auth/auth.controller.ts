import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { UsersService } from '../users/users.service';
import { SignInDTO, SignUpDTO } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller({
    version: '1',
    path: 'auth',
})
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        // private readonly userService: UsersService,
    ){}

    @Post('signup')
    signup(@Body() data: SignUpDTO) {
        return this.authService.signup(data);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() data: SignInDTO){
        return this.authService.signIn(data);
    }

    @Get('protegido')
    @UseGuards(AuthGuard('jwt'))
    protected(){
        return { message: 'Authenticated!' }
    }

}
