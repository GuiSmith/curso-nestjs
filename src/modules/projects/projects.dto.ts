import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { TaskListItemDTO } from '../tasks/task.dto'

export class ProjectRequestDTO {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string

  @ApiProperty({ description: 'Project description', required: false })
  @IsString()
  @MaxLength(255)
  description: string
}

export class ProjectListItemDTO {
  @ApiProperty() id: string
  @ApiProperty() name: string
  @ApiProperty() description: string | null
  @ApiProperty({ format: 'date-time' }) createdAt: Date
  @ApiProperty({ format: 'date-time' }) updateAt: Date
}

export class ProjectTaskDTO extends ProjectListItemDTO {
  @ApiProperty({ type: [TaskListItemDTO] }) tasks: TaskListItemDTO[]
}
