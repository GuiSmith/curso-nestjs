import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserListFullItemDTO, UserListItemDTO, UserRequestDTO } from './users.dto';

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<UserListFullItemDTO> {
        const user = await this.prisma.user.findFirst({
            where: { id },
            include: { createdProjects: true }
        });

        
        if(!user){
            throw new NotFoundException('Usuário não encontrado');
        }
        
        const { password: _, ...safeUser } = user;

        return safeUser;
    }

    async findByEmail(email: string): Promise<UserListFullItemDTO> {
        const user = await this.prisma.user.findFirst({
            where: { email },
            include: { createdProjects: true }
        });

        if(!user){
            throw new NotFoundException('Usuário não encontrado');
        }

        const { password: _, ...safeUser } = user;

        return safeUser;
    }

    async findAll(): Promise<UserListFullItemDTO[]> {
        const users = await this.prisma.user.findMany({
            include: { createdProjects: true }
        });

        const safeUsers = users.map(({ password: _, ...safeUser }) => safeUser);

        return safeUsers;
    }

    async create(data: UserRequestDTO): Promise<UserListFullItemDTO> {
        const user = await this.prisma.user.create({
            data,
            include: { createdProjects: true }
        });

        const { password: _, ...safeUser } = user;

        return safeUser;
    }

    async update(id: string, data: UserRequestDTO): Promise<UserListFullItemDTO> {
        await this.findById(id);

        const user = await this.prisma.user.update({
            where: { id },
            data,
            include: { createdProjects: true },
        });

        const { password: _, ...safeUser } = user;

        return safeUser;
    }

}
