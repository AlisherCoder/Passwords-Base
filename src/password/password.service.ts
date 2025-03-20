import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class PasswordService {
  constructor(private prisma: PrismaService) {}

  async create(createPasswordDto: CreatePasswordDto, req: Request) {
    let user = req['user'];
    try {
      let data = await this.prisma.password.create({
        data: { ...createPasswordDto, userId: user.id },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findAll(req: Request) {
    let user = req['user'];
    try {
      let data = await this.prisma.password.findMany({
        where: { userId: user.id },
      });

      if (!data.length) {
        return new NotFoundException('Not found data');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findOne(id: string, req: Request) {
    let user = req['user'];
    try {
      let data = await this.prisma.password.findFirst({
        where: { userId: user.id, id },
      });

      if (!data) {
        return new NotFoundException('Not found data');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: string, updatePasswordDto: UpdatePasswordDto, req: Request) {
    let user = req['user'];
    try {
      let data = await this.prisma.password.update({
        data: updatePasswordDto,
        where: { userId: user.id, id },
      });

      if (!data) {
        return new NotFoundException('Not found data');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: string, req: Request) {
    let user = req['user'];
    try {
      let data = await this.prisma.password.delete({
        where: { userId: user.id, id },
      });

      if (!data) {
        return new NotFoundException('Not found data');
      }

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
