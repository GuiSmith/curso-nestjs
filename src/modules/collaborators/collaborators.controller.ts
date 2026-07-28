import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { CollaboratorCreateDTO, CollaboratorListItemDTO, CollaboratorUpdateDTO } from './collaborators.dto'
import { CollaboratorsService } from './collaborators.service'
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto'
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator'
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator'
import { AuthenticatedUserDTO } from '../users/users.dto'

@Controller({
  version: '1',
  path: 'projects/:projectId/collaborators',
})
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Get()
  @ApiPaginatedResponse(CollaboratorListItemDTO)
  findAllByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: QueryPaginationDTO
  ) {
    return this.collaboratorsService.findAllByProject(projectId, query)
  }

  @Post()
  @ApiResponse({
    type: CollaboratorListItemDTO,
  })
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: CollaboratorCreateDTO,
  ) {
    return this.collaboratorsService.create(projectId, data)
  }

  @Get(':collaboratorId')
  @ApiResponse({
    type: CollaboratorListItemDTO,
  })
  findOne(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string
  ) {
    return this.collaboratorsService.findById(projectId, collaboratorId)
  }

  @Put(':collaboratorId')
  @ApiResponse({
    type: CollaboratorListItemDTO,
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
    @Body() data: CollaboratorUpdateDTO
  ) {
    return this.collaboratorsService.update(projectId, collaboratorId, data)
  }

  @Delete(':collaboratorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string
  ) {
    return this.collaboratorsService.remove(projectId, collaboratorId)
  }
}
