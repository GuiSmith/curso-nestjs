import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { CollaboratorCreateDTO, CollaboratorListItemDTO, CollaboratorUpdateDTO } from './collaborators.dto'
import { CollaboratorsService } from './collaborators.service'

@Controller({
  version: '1',
  path: 'projects/:projectId/collaborators',
})
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Get()
  @ApiResponse({
    type: [CollaboratorListItemDTO],
  })
  findAllByProject(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.collaboratorsService.findAllByProject(projectId)
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
  findOne(@Param('collaboratorId', ParseUUIDPipe) collaboratorId: string) {
    return this.collaboratorsService.findById(collaboratorId)
  }

  @Put(':collaboratorId')
  @ApiResponse({
    type: CollaboratorListItemDTO,
  })
  update(@Param('collaboratorId', ParseUUIDPipe) collaboratorId: string, @Body() data: CollaboratorUpdateDTO) {
    return this.collaboratorsService.update(collaboratorId, data)
  }

  @Delete(':collaboratorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('projectId', ParseUUIDPipe) projectId: string, @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string) {
    return this.collaboratorsService.remove(projectId, collaboratorId)
  }
}
