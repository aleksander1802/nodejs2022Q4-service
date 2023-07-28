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
import { db } from 'src/database/db';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const version = 1;

    if (!isString(login) || !isString(password)) {
      throw new BadRequestException('Login and password are required fields');
    }

    const newUser: User = {
      id: uuidv4(),
      login,
      password,
      version,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    db.users.push(newUser);

    return newUser;
  }

  findAll(): User[] {
    return db.users;
  }

  findOne(id: string): User {
    const currentUser = db.users.find((user) => user.id === id);

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

    const user = db.users.find((user) => user.id === id);

    if (user) {
      const old = user.password;

      if (old !== oldPassword) {
        throw new ForbiddenException('Old password is wrong');
      }

      const updateUser = {
        ...user,
        password: newPassword,
        version: user.version + 1,
        updatedAt: Date.now(),
      };

      db.users = db.users.map((u) => (u.id === id ? updateUser : u));

      return updateUser;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  remove(id: string) {
    const user = db.users.find((user) => user.id === id);
    if (user) {
      db.users = db.users.filter((user) => user.id !== id);
    } else {
      throw new NotFoundException('User not found');
    }
  }
}
