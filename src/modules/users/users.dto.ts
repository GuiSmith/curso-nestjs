import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator"
import { Role } from "@prisma/client";
import { ProjectListItemDTO } from "../projects/projects.dto"


export class UserRequestDTO {

    @ApiProperty({ description: "User's name" })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(30)
    name: string

    @ApiProperty({ description: "User's email" })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ description: "User's password" })
    @IsString()
    @IsNotEmpty()
    password: string

    @ApiProperty({ description: "User's avatar", required: false })
    @IsOptional()
    @IsString()
    avatar?: string

    @ApiProperty({ description: 'User role', enum: Role, default: Role.ADMIN, required: false })
    @IsEnum(Role)
    @IsOptional()
    role?: Role = Role.ADMIN
}

export class UserListItemDTO {
    @ApiProperty({ description: "User's id" })
    id: string

    @ApiProperty({ description: "User's name" })
    name: string

    @ApiProperty({ description: "User's email" })
    email: string

    @ApiProperty({ type: String, description: "User's avatar", required: false, nullable: true })
    avatar: string | null

    @ApiProperty({ description: "User's creation date", format: 'date-time' })
    createdAt: Date

    @ApiProperty({ description: "User's last update date", format: 'date-time' })
    updatedAt: Date
}

export class UserListFullItemDTO extends UserListItemDTO {
    @ApiProperty({ description: "User's projects", type: [ProjectListItemDTO] })
    createdProjects: ProjectListItemDTO[]
}

export class AuthenticatedUserDTO {
    id: string
    name: string
    email: string
    avatar: string | null
}