import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ProjectListItemDTO, ProjectRequestDTO, ProjectTaskDTO } from './projects.dto'
import { ProjectsService } from './projects.service'
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator'
import { AuthenticatedUserDTO } from '../users/users.dto'
import { QueryPaginationDTO, PaginatedResponseDTO } from 'src/common/dtos/query-pagination.dto'

@Controller({
  version: '1',
  path: 'projects',
})
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({
    type: [ProjectListItemDTO]
  })
  findAll(
    @AuthenticatedUser() user: AuthenticatedUserDTO,
    @Query() query: QueryPaginationDTO
  ) {
    return this.projectsService.findAll(user.id, query)
  }

  @Get(':id')
  @ApiResponse({
    type: ProjectTaskDTO,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.findById(id)
  }

  @Post()
  @ApiResponse({
    type: ProjectListItemDTO,
  })
  create(@Body() data: ProjectRequestDTO) {
    return this.projectsService.create(data)
  }

  @Put(':id')
  @ApiResponse({
    type: ProjectListItemDTO,
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDTO) {
    return this.projectsService.update(id, data)
  }
}
