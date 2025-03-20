import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      let data = await this.prisma.user.findMany({ where: { role: 'USER' } });
      if (!data.length) {
        return new NotFoundException('Not found users');
      }
      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let data = await this.prisma.user.findFirst({ where: { id } });
      if (!data) {
        return new NotFoundException('Not found data');
      }
      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateAuthDto) {
    try {
      let user = await this.prisma.user.findFirst({ where: { id } });
      if (!user) {
        return new NotFoundException('Not found data');
      }

      let data = await this.prisma.user.update({
        data: updateUserDto,
        where: { id },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      let data = await this.prisma.user.delete({ where: { id } });
      if (!data) {
        return new NotFoundException('Not found data');
      }
      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getMyData(req: Request) {
    let user = req['user'];
    try {
      let session = await this.prisma.session.findFirst({
        where: { userId: user.id, ipAddress: req.ip },
      });

      if (!session) {
        return new UnauthorizedException('Unauthorized');
      }

      let data = await this.prisma.user.findFirst({
        where: { id: user.id },
        include: { Password: true },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async getMySessions(req: Request) {
    let user = req['user'];
    try {
      let data = await this.prisma.session.findMany({
        where: { userId: user.id },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async delSession(req: Request, id: string) {
    let user = req['user'];
    try {
      let data = await this.prisma.session.delete({
        where: { userId: user.id, id },
      });

      return { data };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }
}
