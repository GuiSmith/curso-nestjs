import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordRequestDTO, ForgotPasswordResponseDTO, ResetPasswordDTO, SignInDTO, SignUpDTO, TokenResponseDTO } from './auth.dto';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { AuthenticatedUserDTO } from '../users/users.dto';

@Controller({
    version: '1',
    path: 'auth',
})
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    @PublicRoute()
    @ApiResponse({ type: TokenResponseDTO })
    signup(@Body() data: SignUpDTO) {
        return this.authService.signup(data);
    }

    @Post('signin')
    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ type: TokenResponseDTO })
    signin(@Body() data: SignInDTO){
        return this.authService.signIn(data);
    }

    @Post('forgot-password')
    @PublicRoute()
    @ApiResponse({ type: ForgotPasswordResponseDTO })
    @HttpCode(HttpStatus.OK)
    forgotPassword(@Body() data: ForgotPasswordRequestDTO) {
        return this.authService.forgotPassword(data.email);
    }

    @Post('reset-password')
    @PublicRoute()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ type: AuthenticatedUserDTO })
    resetPassword(@Body() data: ResetPasswordDTO) {
        return this.authService.resetPassword(data.token, data.newPassword);
    }
}
