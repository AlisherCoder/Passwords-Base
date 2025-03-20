import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ActivateDto,
  CreateAuthDto,
  LoginDto,
  OtpDto,
} from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { totp } from 'otplib';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import * as DeviceDetector from 'device-detector-js';
import { JwtService } from '@nestjs/jwt';

totp.options = { step: 600, digits: 5 };

@Injectable()
export class AuthService {
  private readonly deviceDetector = new DeviceDetector();
  private otpkey = process.env.OTP_KEY;
  private refkey = process.env.REFRESH_KEY;
  private acckey = process.env.ACCESS_KEY;

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    let { email, password } = createAuthDto;
    try {
      let user = await this.prisma.user.findFirst({ where: { email } });
      if (user) {
        return new ConflictException('User already exists.');
      }

      let hash = bcrypt.hashSync(password, 10);
      let newUser = await this.prisma.user.create({
        data: { ...createAuthDto, password: hash },
      });

      let otp = totp.generate(this.otpkey + email);
      await this.mailService.sendMail(
        email,
        'Activation',
        `OTP code for verify account ${otp}`,
      );

      return {
        data: 'Registration was successful, a one-time code was sent to your email.',
        otp,
      };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async login(data: LoginDto, req: Request) {
    let { email, password } = data;
    try {
      let user = await this.prisma.user.findFirst({ where: { email } });
      if (!user) {
        return new UnauthorizedException('Unauthorized.');
      }

      let match = bcrypt.compareSync(password, user.password);
      if (!match) {
        return new BadRequestException('Password or email is wrong.');
      }

      if (!user.status) {
        return new BadRequestException('Your account is not active.');
      }

      let session = await this.prisma.session.findFirst({
        where: { userId: user.id, ipAddress: req.ip },
      });

      if (!session) {
        let useragent: any = req.headers['user-agent'];
        let device: any = this.deviceDetector.parse(useragent);

        await this.prisma.session.create({
          data: { userId: user.id, ipAddress: req.ip!, info: device },
        });
      }

      let refreshToken = this.genRefreshtoken({ id: user.id, role: user.role });
      let accessToken = this.genAccesstoken({ id: user.id, role: user.role });

      return { refreshToken, accessToken };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async activate(data: ActivateDto) {
    let { email, otp } = data;
    try {
      let isValid = totp.check(otp, this.otpkey + email);
      if (!isValid) {
        return new BadRequestException('Email or OTP is wrong');
      }

      let user = await this.prisma.user.update({
        where: { email },
        data: { status: true },
      });

      if (!user) {
        return new UnauthorizedException('Unauthorized.');
      }

      return { data: 'Your account has been successfully activated.', user };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async sendOTP(data: OtpDto) {
    try {
      let user = await this.prisma.user.findFirst({
        where: { email: data.email },
      });

      if (!user) {
        return new UnauthorizedException('Unauthorized.');
      }

      let otp = totp.generate(this.otpkey + data.email);
      await this.mailService.sendMail(
        data.email,
        'One time password',
        `OTP code - ${otp}`,
      );

      return { data: 'OTP sent to your email', otp };
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  genRefreshtoken(paylod: any) {
    return this.jwtService.sign(paylod, {
      secret: this.refkey,
      expiresIn: '7d',
    });
  }

  genAccesstoken(paylod: any) {
    return this.jwtService.sign(paylod, {
      secret: this.acckey,
      expiresIn: '12h',
    });
  }

  refreshToken(req: Request) {
    try {
      let user = req['user'];
      return {
        accessToken: this.genAccesstoken({ id: user.id, role: user.role }),
      };
    } catch (error) {}
  }
}
