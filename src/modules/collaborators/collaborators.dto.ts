import { ApiProperty } from '@nestjs/swagger'
import { CollaboratorRole } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { UserListItemDTO } from '../users/users.dto'

export class CollaboratorCreateDTO {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string

//   @ApiProperty({ description: 'Project ID' })
//   @IsString()
//   @IsNotEmpty()
//   projectId: string

  @ApiProperty({
    description: 'Collaborator role',
    enum: CollaboratorRole,
    default: CollaboratorRole.EDITOR,
    required: false,
  })
  @IsEnum(CollaboratorRole)
  @IsOptional()
  role?: CollaboratorRole = CollaboratorRole.EDITOR
}

export class CollaboratorUpdateDTO {
  @ApiProperty({
    description: 'Collaborator role',
    enum: CollaboratorRole,
    default: CollaboratorRole.EDITOR,
    required: false,
  })
  @IsEnum(CollaboratorRole)
  @IsOptional()
  role?: CollaboratorRole = CollaboratorRole.EDITOR
}

export class CollaboratorListItemDTO {
  @ApiProperty({ description: 'Collaborator ID' })
  id: string

  @ApiProperty({
    description: 'Collaborator role',
    enum: CollaboratorRole,
  })
  role: CollaboratorRole

  @ApiProperty({ description: 'User', type: UserListItemDTO })
  user: UserListItemDTO

  @ApiProperty({ description: 'Project ID' })
  projectId: string

  @ApiProperty({ description: 'Collaborator creation date', format: 'date-time' })
  createdAt: Date
}
