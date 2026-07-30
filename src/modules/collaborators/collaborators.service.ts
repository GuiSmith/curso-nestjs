import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CollaboratorCreateDTO, CollaboratorListItemDTO, CollaboratorUpdateDTO } from './collaborators.dto'
import { CollaboratorRole } from '@prisma/client'
import { PaginatedResponseDTO, QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { paginate, paginateOutput } from 'src/common/utils/pagination.utils'
import { RequestContextService } from 'src/common/services/request-context.service'
import { COLLABORATOR_ROLE_ADMIN_KEY, COLLABORATOR_ROLE_VIEWER_KEY } from 'src/consts'

@Injectable()
export class CollaboratorsService {

  private readonly roleValues: Record<CollaboratorRole, number> = {
    VIEWER: 1,
    EDITOR: 2,
    ADMIN: 3,
    OWNER: 4,
  };

  private readRole = COLLABORATOR_ROLE_VIEWER_KEY;
  private writeRole = COLLABORATOR_ROLE_ADMIN_KEY;

  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  async hasPermission (projectId: string, userId: string, role: CollaboratorRole): Promise<boolean> {
    
    const collaborator = await this.prisma.projectCollaborator.findUnique({
      where: { userId_projectId: { userId, projectId } }
    });

    if(!collaborator){
      return false;
    }

    const roleValue = this.roleValues[collaborator.ROLE];

    return roleValue >= this.roleValues[role];
  }

  async findAllByProject(projectId: string, query?: QueryPaginationDTO): Promise<PaginatedResponseDTO<CollaboratorListItemDTO>> {

    const currentAuthenticatedUser = this.requestContext.getUser();

    const hasPermission = await this.hasPermission(projectId, currentAuthenticatedUser.id, this.readRole);

    if(!hasPermission){
      throw new ForbiddenException();
    }

    const where = { projectId };

    const [collaboratorsList, total] = await Promise.all([
      this.prisma.projectCollaborator.findMany({ ...paginate(query), where, include: { user: true } }),
      this.prisma.projectCollaborator.count({ where }),
    ]);

    const collaborators =  collaboratorsList.map(({ ROLE: role, user, ...collaborator }) => {
      const { password: _, role: _userRole, ...safeUser } = user

      return { ...collaborator, role, user: safeUser }
    })

    return paginateOutput<CollaboratorListItemDTO>(collaborators, total, query);
  }

  async findById(projectId: string, id: string): Promise<CollaboratorListItemDTO> {

    const currentAuthenticatedUser = this.requestContext.getUser();

    const hasPermission = await this.hasPermission(projectId, currentAuthenticatedUser.id, this.readRole);

    if(!hasPermission){
      throw new ForbiddenException();
    }

    const collaborator = await this.prisma.projectCollaborator.findUnique({
      where: { id, projectId },
      include: { user: true },
    })

    if (!collaborator) {
      throw new NotFoundException('Colaborador não encontrado')
    }

    const { ROLE: role, user, ...collaboratorData } = collaborator
    const { password: _, role: _userRole, ...safeUser } = user

    return { ...collaboratorData, role, user: safeUser }
  }

  async create(projectId: string, data: CollaboratorCreateDTO): Promise<CollaboratorListItemDTO> {

    const currentAuthenticatedUser = this.requestContext.getUser();

    const hasPermission = await this.hasPermission(projectId, currentAuthenticatedUser.id, this.writeRole);

    if(!hasPermission){
      throw new ForbiddenException();
    }

    const existingCollaborator = await this.prisma.projectCollaborator.findUnique({
      where: {
        userId_projectId: {
          userId: data.userId,
          projectId,
        },
      },
    })

    if (existingCollaborator) {
      throw new ConflictException('Usuário já é colaborador deste projeto')
    }

    if(data.role === CollaboratorRole.OWNER){
      throw new ConflictException("You cannot set a collaborator as owner");
    }

    const collaborator = await this.prisma.projectCollaborator.create({
      data: {
        userId: data.userId,
        projectId,
        ROLE: data.role,
      },
      include: { user: true },
    })

    const { ROLE: role, user, ...collaboratorData } = collaborator
    const { password: _, role: _userRole, ...safeUser } = user

    return { ...collaboratorData, role, user: safeUser }
  }

  async update(projectId: string, collaboratorId: string, data: CollaboratorUpdateDTO): Promise<CollaboratorListItemDTO> {

    const currentAuthenticatedUser = this.requestContext.getUser();

    const hasPermission = await this.hasPermission(projectId, currentAuthenticatedUser.id, this.writeRole);

    if(!hasPermission){
      throw new ForbiddenException();
    }

    const existingCollaborator = await this.prisma.projectCollaborator.findFirst({
      where: { id: collaboratorId, projectId },
      include: { user: true, project: true }
    });

    if(!existingCollaborator){
      throw new NotFoundException('Collaborator not found');
    }

    if(existingCollaborator.project.createdById === existingCollaborator.userId){
      throw new ConflictException("You cannot change the role of the owner of the project");
    }

    if(data.role === CollaboratorRole.OWNER){
      throw new ConflictException("You cannot set a collaborator as owner");
    }

    const collaborator = await this.prisma.projectCollaborator.update({
      where: { id: collaboratorId, projectId },
      data: { ROLE: data.role },
      include: { user: true },
    })

    const { ROLE: role, user, ...collaboratorData } = collaborator
    const { password: _, role: _userRole, ...safeUser } = user

    return { ...collaboratorData, role, user: safeUser }
  }

  async remove(projectId: string, id: string): Promise<CollaboratorListItemDTO> {

    const currentAuthenticatedUser = this.requestContext.getUser();

    const hasPermission = await this.hasPermission(projectId, currentAuthenticatedUser.id, this.writeRole);

    if(!hasPermission){
      throw new ForbiddenException();
    }

    const existingCollaborator = await this.prisma.projectCollaborator.findFirst({
      where: { id, projectId },
      include: { user: true, project: true }
    });

    if(!existingCollaborator){
      throw new NotFoundException('Collaborator not found');
    }

    if(existingCollaborator.project.createdById === existingCollaborator.userId){
      throw new ConflictException("You cannot remove the owner of the project as a collaborator");
    }

    const collaborator = await this.prisma.projectCollaborator.delete({
      where: { id },
      include: { user: true },
    })

    const { ROLE: role, user, ...collaboratorData } = collaborator
    const { password: __, role: _userRole, ...safeUser } = user

    return { ...collaboratorData, role, user: safeUser }
  }
}
