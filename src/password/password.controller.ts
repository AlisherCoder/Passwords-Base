import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PasswordService } from './password.service';
import { CreatePasswordDto } from './dto/create-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPasswordDto: CreatePasswordDto, @Req() req: Request) {
    return this.passwordService.create(createPasswordDto, req);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.passwordService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.passwordService.findOne(id, req);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: Request,
  ) {
    return this.passwordService.update(id, updatePasswordDto, req);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.passwordService.remove(id, req);
  }
}
