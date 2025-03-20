import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateAuthDto } from 'src/auth/dto/update-auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role, Roles } from 'src/guards/roles.decorator';
import { SelfGuard } from 'src/guards/self.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('mydata')
  getMyData(@Req() req: Request) {
    return this.userService.getMyData(req);
  }

  @UseGuards(AuthGuard)
  @Get('sessions')
  getMySessions(@Req() req: Request) {
    return this.userService.getMySessions(req);
  }

  @UseGuards(AuthGuard)
  @Delete('session:id')
  delSession(@Req() req: Request, @Param('id') id: string) {
    return this.userService.delSession(req, id);
  }

  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(SelfGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(SelfGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateAuthDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(SelfGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
