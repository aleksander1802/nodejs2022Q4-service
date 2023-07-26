import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const newUser = this.usersService.create(createUserDto);
    const userWithoutSensitiveData = plainToClass(CreateUserDto, newUser, {
      excludePrefixes: ['password'],
    });
    return userWithoutSensitiveData;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePasswordDto: UpdateUserDto) {
    const updatedUser = this.usersService.update(id, updatePasswordDto);
    const userWithoutPassword = { ...updatedUser, password: undefined };
    return userWithoutPassword;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ValidationPipe) id: string) {
    this.usersService.remove(id);
  }
}
