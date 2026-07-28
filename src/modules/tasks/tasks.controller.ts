import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TaskCommentDTO, TaskListItemDTO, TaskRequestDTO } from './task.dto'
import { ApiResponse } from '@nestjs/swagger'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator'

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks',
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiPaginatedResponse(TaskListItemDTO)
  findAllByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: QueryPaginationDTO
  ) {
    return this.tasksService.findAllByProject(projectId, query)
  }

  @Post()
  @ApiResponse({
    type: TaskListItemDTO
  })
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: TaskRequestDTO) {
    return this.tasksService.create(projectId, data)
  }

  @Get(':taskId')
  @ApiResponse({
    type: TaskCommentDTO
  })
  findOne(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.tasksService.findById(projectId, taskId)
  }

  @Put(':taskId')
  @ApiResponse({
    type: TaskListItemDTO
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() data: TaskRequestDTO,
  ) {
    return this.tasksService.update(projectId, taskId, data)
  }
}
