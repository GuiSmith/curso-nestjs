import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ProjectListItemDTO, ProjectRequestDTO, ProjectTaskDTO } from './projects.dto'
import { QueryPaginationDTO, PaginatedResponseDTO } from 'src/common/dtos/query-pagination.dto'
import { paginate, paginateOutput } from 'src/common/utils/pagination.utils'
import { RequestContextService } from 'src/common/services/request-context.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  async canEdit(projectId: string): Promise<boolean> {

    const currentAuthenticatedUser = this.requestContext.getUser();
    
    const collaborator = await this.prisma.projectCollaborator.findUnique({
      where: {
        userId_projectId: {
          userId: currentAuthenticatedUser.id,
          projectId
        }
      }
    }
  );

    if(collaborator && ['EDITOR','OWNER'].includes(collaborator.ROLE)) {
      return true;
    }

    return false;
  }

  async findAll(query?: QueryPaginationDTO): Promise<PaginatedResponseDTO<ProjectListItemDTO>> {

    const currentAuthenticatedUser = this.requestContext.getUser();

    const where = { createdById: currentAuthenticatedUser.id };

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

  async create(data: ProjectRequestDTO): Promise<ProjectListItemDTO> {

    const currentAuthenticatedUser = this.requestContext.getUser();

    const userId = currentAuthenticatedUser.id;
    
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
          userId,
          ROLE: 'OWNER'
        }
      });
  
      return project;
    });

    return newProject;
  }

  async update(id: string, data: ProjectRequestDTO): Promise<ProjectListItemDTO> {
    await this.findById(id);

    const canEditProject = await this.canEdit(id);

    if(!canEditProject){
      throw new ForbiddenException();
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
