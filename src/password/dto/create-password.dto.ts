import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePasswordDto {
  @ApiProperty({ example: 'Instagram' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'alex1234' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
