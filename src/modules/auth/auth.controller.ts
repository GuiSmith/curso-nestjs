import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { UsersService } from '../users/users.service';
import { SignInDTO, SignUpDTO } from './auth.dto';
import type { User } from '@prisma/client';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';

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
    @PublicRoute()
    signup(@Body() data: SignUpDTO) {
        return this.authService.signup(data);
    }

    @Post('signin')
    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    signin(@Body() data: SignInDTO){
        return this.authService.signIn(data);
    }

    // @Get('protegido')
    // @UseGuards(JwtAuthGuard)
    // protected(@AuthenticatedUser() user: User){
    //     return { message: `Authenticated!`, user }
    // }
}
