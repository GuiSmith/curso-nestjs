import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { TaskListItemDTO } from '../tasks/task.dto'

export class ProjectRequestDTO {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string

  @ApiProperty({ description: 'Project description', required: false, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string | null
}

export class ProjectListItemDTO {
  @ApiProperty() id: string
  @ApiProperty({ description: "Project's name"}) name: string
  @ApiProperty({ description: "Project's description", type: String, nullable: true }) description: string | null
  @ApiProperty({ description: "Project's creation date", format: 'date-time' }) createdAt: Date
  @ApiProperty({ description: "Project's last update date", format: 'date-time' }) updatedAt: Date
}

export class ProjectTaskDTO extends ProjectListItemDTO {
  @ApiProperty({ type: [TaskListItemDTO] }) tasks: TaskListItemDTO[]
}
