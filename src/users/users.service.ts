import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, +process.env.CRYPT_SALT);

    const version = 1;

    const newUser = await this.prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        version,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const user = {
      ...newUser,
      createdAt: newUser.createdAt.getTime(),
      updatedAt: newUser.updatedAt.getTime(),
    };

    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    }));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const modifiedUser = {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };

    return modifiedUser;
  }

  async findOneByLogin(login: string) {
    const user = await this.prisma.user.findFirst({
      where: { login },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const modifiedUser = {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };

    return modifiedUser;
  }

  async update(id: string, updatePasswordDto: UpdateUserDto) {
    const { newPassword, oldPassword } = updatePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const pass = await bcrypt.compare(oldPassword, user.password);

    if (!pass) {
      throw new ForbiddenException('Old password is wrong');
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      +process.env.CRYPT_SALT,
    );

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });

    const modifiedUser = {
      ...updatedUser,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };

    return modifiedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
