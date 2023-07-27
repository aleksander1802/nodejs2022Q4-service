import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { isString } from 'class-validator';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;

    if (!login || !password) {
      throw new BadRequestException('Login and password are required fields');
    }

    const newUser: User = {
      id: uuidv4(),
      login: login,
      password: password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const currentUser = this.users.find((user) => user.id === id);

    if (currentUser) {
      return currentUser;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  update(id: string, updatePasswordDto: UpdateUserDto): User {
    const { newPassword, oldPassword } = updatePasswordDto;

    if (!isString(newPassword)) {
      throw new BadRequestException('Invalid dto');
    }

    const user = this.users.find((user) => user.id === id);

    if (user) {
      const old = user.password;
      if (old !== oldPassword) {
        throw new ForbiddenException('Old password is wrong');
      }

      user.password = newPassword;
      user.version += 1;
      user.updatedAt = Date.now();

      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  remove(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    } else {
      throw new NotFoundException('User not found');
    }
  }
}
