import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import type { Project } from '@prisma/client';
import { ProjectListItemDTO, ProjectRequestDTO, ProjectTaskDTO } from './projects.dto'
import { QueryPaginationDTO, PaginatedResponseDTO } from 'src/common/dtos/query-pagination.dto'
import { paginate, paginateOutput } from 'src/common/utils/pagination.utils'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(createdById: string, query?: QueryPaginationDTO): Promise<PaginatedResponseDTO<ProjectListItemDTO>> {

    const where = { createdById };

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({ ...paginate(query), where }),
      this.prisma.project.count({ where })
    ]);

    return paginateOutput<ProjectListItemDTO>(projects, total, query);
  }

  async findById(id: string): Promise<ProjectTaskDTO> {
    const project = await this.prisma.project.findFirst({
      where: { id },
      include: { tasks: true }
    })

    if (!project) {
      throw new NotFoundException('Projeto não encontrado')
    }

    return project
  }

  async create(userId: string, data: ProjectRequestDTO): Promise<ProjectListItemDTO> {
    
    const newProject = await this.prisma.$transaction(async tx => {

      const project = await tx.project.create({
        data: {
          ...data,
          createdById: userId,
        }
      });
            
      const collaborator = await tx.projectCollaborator.create({
        data: {
          projectId: project.id,
          userId: userId,
          ROLE: 'OWNER'
        }
      });
  
      return project;
    });

    return newProject;
  }

  async update(id: string, data: ProjectRequestDTO): Promise<ProjectListItemDTO> {
    const existingProject = await this.prisma.project.findFirst({ where: { id }})

    if (!existingProject) {
      throw new NotFoundException('Projeto não encontrado')
    }

    const updatedProject = await this.prisma.project.update({ where: { id }, data })

    if (!updatedProject) {
      throw new InternalServerErrorException(
        'Projeto não atualizado. Contate o suporte',
      )
    }

    return updatedProject
  }
}
