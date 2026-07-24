import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserListFullItemDTO, UserRequestDTO } from './users.dto';
import { ApiResponse } from '@nestjs/swagger';

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
    findAll() {
        return this.userService.findAll();
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
