import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDTO {
    @ApiProperty({ description: 'User name' })
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty({ description: 'User email', uniqueItems: true })
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ description: 'User password', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string
}

export class SignInDTO {
    @ApiProperty({ description: 'User email'})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({ description: 'User password'})
    @IsString()
    @IsNotEmpty()
    password: string
}

export class TokenResponseDTO {
    @ApiProperty({ description: 'authentication bearer token'})
    token: string
}

export class ForgotPasswordRequestDTO {
    @ApiProperty({ description: 'User email'})
    @IsEmail()
    @IsNotEmpty()
    email: string
}

export class ForgotPasswordResponseDTO {
    @ApiProperty({ description: 'Response message'})
    message: string
}

export class ResetPasswordDTO {
    @ApiProperty({ description: 'reset token'})
    @IsString()
    @IsNotEmpty()
    token: string

    @ApiProperty({ description: 'New password', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string
}
