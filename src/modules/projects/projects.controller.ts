import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ProjectListItemDTO, ProjectRequestDTO, ProjectTaskDTO } from './projects.dto'
import { ProjectsService } from './projects.service'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator'

@Controller({
  version: '1',
  path: 'projects',
})
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiPaginatedResponse(ProjectListItemDTO)
  findAll(@Query() query: QueryPaginationDTO) {
    return this.projectsService.findAll(query)
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
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: ProjectRequestDTO) {
    return this.projectsService.update(id, data)
  }
}
