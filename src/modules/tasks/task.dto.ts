import { ApiProperty } from '@nestjs/swagger'
import { TaskPriority, TaskStatus } from '@prisma/client'
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class TaskRequestDTO {
  @ApiProperty({ description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string

  @ApiProperty({ description: 'Task description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.TODO,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus

  @ApiProperty({
    description: 'Task priority',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority

  @ApiProperty({
    description: 'Task due date',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string
}

export class TaskListItemDTO {
  @ApiProperty() id: string
  @ApiProperty() title: string
  @ApiProperty() description: string | null
  @ApiProperty({ enum: TaskStatus }) status: TaskStatus
  @ApiProperty({ enum: TaskPriority }) priority: TaskPriority
  @ApiProperty({ format: 'date-time', required: false, type: Date, nullable: true }) dueDate: Date | null
  @ApiProperty() projectId: string
  @ApiProperty({ format: 'date-time' }) createdAt: Date
  @ApiProperty({ format: 'date-time' }) updatedAt: Date
}
