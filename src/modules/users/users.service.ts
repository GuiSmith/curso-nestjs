import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserListFullItemDTO, UserListItemDTO, UserRequestDTO } from './users.dto';
import { User } from '@prisma/client';
import { PaginatedResponseDTO, QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto';
import { paginate, paginateOutput } from 'src/common/utils/pagination.utils';
import * as bcrypt from 'bcrypt';
import { SignUpDTO } from '../auth/auth.dto';
import { RequestContextService } from 'src/common/services/request-context.service';

@Injectable()
export class UsersService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly requestContextService: RequestContextService,
    ) {}

    private select = {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        createdProjects: true
    };

    private async getHashedPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    async updatePassword(email: string, password: string): Promise<UserListFullItemDTO> {
        await this.findByEmail(email);
        
        const hashedPassword = await this.getHashedPassword(password);

        const updatedUser = this.prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
            select: this.select
        });

        return updatedUser;
    }

    async findById(id: string): Promise<UserListFullItemDTO> {

        if(!this.requestContextService.isUserAdmin()){
            throw new ForbiddenException();
        }

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

        if(!this.requestContextService.isUserAdmin()){
            throw new ForbiddenException();
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({ ...paginate(query), select: this.select }),
            this.prisma.user.count()
        ]);

        return paginateOutput<UserListFullItemDTO>(users, total, query);
    }

    async create(data: SignUpDTO): Promise<UserListFullItemDTO> {

        const user = await this.prisma.$transaction(async tx => {
            const existingEmail = await tx.user.findFirst({ where: { email: data.email }});

            if(existingEmail){
                throw new ConflictException("This email is already being used by another user");
            }

            const hashedPassword = await this.getHashedPassword(data.password);
            
            const createdUser = await tx.user.create({
                data: { ...data, password: hashedPassword },
                select: this.select
            });

            return createdUser;

        });

        return user;
    }

    async update(id: string, data: UserRequestDTO): Promise<UserListFullItemDTO> {

        if(this.requestContextService.getUser().id !== id){
            throw new ForbiddenException();
        }

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

            const hashedPassword = await this.getHashedPassword(data.password);

            const createdUser = await tx.user.update({
                where: { id },
                data: { ...data, password: hashedPassword },
                select: this.select,
            });

            return createdUser;
            
        });

        return user;
    }

}
