import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUserDTO, UserListFullItemDTO, UserListItemDTO, UserRequestDTO } from './users.dto';
import { User } from '@prisma/client';
import { toSafeUser } from 'src/common/mappers/toSafeUser.mapper';

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<AuthenticatedUserDTO> {
        const user = await this.prisma.user.findFirst({
            where: { id },
            include: { createdProjects: true }
        });

        
        if(!user){
            throw new NotFoundException('Usuário não encontrado');
        }

        return toSafeUser(user);
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { createdProjects: true }
        });

        if(!user){
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async isEmailAvailable(email: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { createdProjects: true }
        });

        if(user){
            return false;
        }

        return true;
    }

    async findAll(): Promise<UserListFullItemDTO[]> {
        const users = await this.prisma.user.findMany({
            include: { createdProjects: true }
        });

        const safeUsers = users.map(({ password: _, ...safeUser }) => safeUser);

        return safeUsers;
    }

    async create(data: UserRequestDTO): Promise<UserListFullItemDTO> {

        const user = await this.prisma.$transaction(async tx => {
            const existingEmail = await tx.user.findFirst({ where: { email: data.email }});

            if(existingEmail){
                throw new ConflictException("This email is already being used by another user");
            }
            
            const createdUser = await tx.user.create({
                data,
                include: { createdProjects: true }
            });

            return createdUser;

        });

        const { password: _, ...safeUser } = user;

        return safeUser;
    }

    async update(id: string, data: UserRequestDTO): Promise<UserListFullItemDTO> {

        const user = await this.prisma.$transaction(async tx => {
            const existingUser = await tx.user.findFirst({ where: { id } });

            if(!existingUser){
                throw new NotFoundException('User not found');
            }

            if(existingUser.email !== data.email){
                const existingEmail = await tx.user.findFirst({
                    where: {
                        email: data.email,
                        NOT: { id }
                    }
                });

                if(existingEmail){
                    throw new ConflictException("This email is already being used by another user");
                }
            }

            const createdUser = await tx.user.update({
                where: { id },
                data,
                include: { createdProjects: true },
            });

            return createdUser;
            
        });

        const { password: _, ...safeUser } = user;

        return safeUser;
    }

}
