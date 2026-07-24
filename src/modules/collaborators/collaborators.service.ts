import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CollaboratorCreateDTO, CollaboratorListItemDTO, CollaboratorUpdateDTO } from './collaborators.dto'

@Injectable()
export class CollaboratorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProject(projectId: string): Promise<CollaboratorListItemDTO[]> {
    const collaborators = await this.prisma.projectCollaborator.findMany({
      where: { projectId },
      include: { user: true },
    })

    return collaborators.map(({ ROLE: role, user, ...collaborator }) => {
      const { password: _, role: _userRole, ...safeUser } = user

      return { ...collaborator, role, user: safeUser }
    })
  }

  async findById(id: string): Promise<CollaboratorListItemDTO> {
    const collaborator = await this.prisma.projectCollaborator.findUnique({
      where: { id },
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

  async update(collaboratorId: string, data: CollaboratorUpdateDTO): Promise<CollaboratorListItemDTO> {
    await this.findById(collaboratorId)

    const collaborator = await this.prisma.projectCollaborator.update({
      where: { id: collaboratorId },
      data: { ROLE: data.role },
      include: { user: true },
    })

    const { ROLE: role, user, ...collaboratorData } = collaborator
    const { password: _, role: _userRole, ...safeUser } = user

    return { ...collaboratorData, role, user: safeUser }
  }

  async remove(projectId: string, id: string): Promise<CollaboratorListItemDTO> {
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
    const { password: _, role: _userRole, ...safeUser } = user

    return { ...collaboratorData, role, user: safeUser }
  }
}
