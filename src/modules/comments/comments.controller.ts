import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { CommentFullDTO, CommentListItemDTO, CommentRequestDTO } from './comments.dto'
import { CommentsService } from './comments.service'

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks/:taskId/comments',
})
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiResponse({
    type: [CommentListItemDTO],
  })
  findAllByTask(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ) {
    return this.commentsService.findAllByTask(projectId, taskId)
  }

  @Post()
  @ApiResponse({
    type: CommentListItemDTO,
  })
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() data: CommentRequestDTO,
  ) {
    return this.commentsService.create(projectId, taskId, data)
  }

  @Get(':commentId')
  @ApiResponse({
    type: CommentFullDTO,
  })
  findOne(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.commentsService.findById(projectId, taskId, commentId)
  }

  @Put(':commentId')
  @ApiResponse({
    type: CommentListItemDTO,
  })
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Body() data: CommentRequestDTO,
  ) {
    return this.commentsService.update(projectId, taskId, commentId, data)
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Param('commentId', ParseUUIDPipe) commentId: string,
  ) {
    return this.commentsService.delete(projectId, taskId, commentId)
  }
}
