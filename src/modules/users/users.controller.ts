import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserListFullItemDTO, UserRequestDTO } from './users.dto';
import { ApiResponse } from '@nestjs/swagger';
import { QueryPaginationDTO } from 'src/common/dtos/query-pagination.dto';

@Controller({
    version: '1',
    path: 'users',
})
export class UsersController {

    constructor(private readonly userService: UsersService){}

    @Get()
    @ApiResponse({
        type: [UserListFullItemDTO]
    })
    findAll(@Query() query: QueryPaginationDTO) {
        return this.userService.findAll(query);
    }

    @Get(':userId')
    @ApiResponse({
        type: UserListFullItemDTO
    })
    findById(@Param('userId', ParseUUIDPipe) userId: string) {
        return this.userService.findById(userId);
    }

    @Post()
    @ApiResponse({
        type: UserListFullItemDTO
    })
    create(@Body() data: UserRequestDTO) {
        return this.userService.create(data);
    }

    @Put(':userId')
    @ApiResponse({
        type: UserListFullItemDTO
    })
    update(@Param('userId', ParseUUIDPipe) userId: string, @Body() data: UserRequestDTO) {
        return this.userService.update(userId, data);
    }
}
