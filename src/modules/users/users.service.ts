import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUserDTO, UserListFullItemDTO, UserListItemDTO, UserRequestDTO } from './users.dto';
import { User } from '@prisma/client';
import { toSafeUser } from 'src/common/mappers/toSafeUser.mapper';
import { PaginatedResponseDTO, QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto';
import { paginate, paginateOutput } from 'src/common/utils/pagination.utils';

@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) {}

    private select = {
        id: true,
        name: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        createdProjects: true
    };

    async findById(id: string): Promise<UserListFullItemDTO> {
        const user = await this.prisma.user.findFirst({
            where: { id },
            select: this.select
        });

        
        if(!user){
            throw new NotFoundException('Usuário não encontrado');
        }

        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { email } });

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

    async findAll(query?: QueryPaginationDTO): Promise<PaginatedResponseDTO<UserListFullItemDTO>> {

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({ ...paginate(query), select: this.select }),
            this.prisma.user.count()
        ]);

        return paginateOutput<UserListFullItemDTO>(users, total, query);
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
