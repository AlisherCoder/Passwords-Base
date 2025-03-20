import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, max } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'Alex' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'image.png' })
  @IsNotEmpty()
  @IsString()
  image: string;

  @ApiProperty({ example: 'alex@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ActivateDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class LoginDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class OtpDto {
  @ApiProperty({ example: 'alex@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refreshToken' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
