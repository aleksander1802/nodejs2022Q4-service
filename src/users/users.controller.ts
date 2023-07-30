import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: 'Create a new user',
  })
  @ApiCreatedResponse({ description: 'The user has been created', type: User })
  @ApiBadRequestResponse({
    description: 'Bad request. Body does not contain required fields',
  })
  @ApiUnauthorizedResponse({ description: 'The user is not authorized' })
  create(@Body() createUserDto: CreateUserDto) {
    const newUser = this.usersService.create(createUserDto);
    return plainToClass(User, newUser);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users',
  })
  @ApiOkResponse({ description: 'Successful operation', type: [User] })
  findAll() {
    const users = this.usersService.findAll();
    return plainToInstance(User, users);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single user by id',
    description: 'Get single user by id',
  })
  @ApiOkResponse({ description: 'Successful operation', type: User })
  @ApiBadRequestResponse({
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = this.usersService.findOne(id);
    return plainToClass(User, user);
  }

  @Put(':id')
  @ApiOperation({
    summary: "Update a user's password",
    description: "Updates a user's password by ID",
  })
  @ApiOkResponse({ description: 'The user has been updated.' })
  @ApiForbiddenResponse({ description: 'oldPassword is wrong', type: User })
  @ApiBadRequestResponse({
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = this.usersService.update(id, updateUserDto);
    return plainToClass(User, updatedUser);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Deletes user by ID.',
  })
  @ApiNoContentResponse({ description: 'The user has been deleted' })
  @ApiBadRequestResponse({
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    this.usersService.remove(id);
  }
}
