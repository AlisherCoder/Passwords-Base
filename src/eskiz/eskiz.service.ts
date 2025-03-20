import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EskizService {
  private token;
  private baseUrl = 'https://notify.eskiz.uz/api';
  private email = 'alishersharipov670@gmail.com';
  private password = '';
  constructor() {
    // this.auth();
  }

  async auth() {
    try {
      let { data: response } = await axios.post(`${this.baseUrl}/auth/login`, {
        email: this.email,
        password: this.password,
      });

      this.token = response?.data?.token;
    } catch (error) {
      return new BadRequestException(error.message);
    }
  }

  async sendSMS(message: string, phone: string) {
    console.log(message, phone);
    try {
      let { data: response } = await axios.post(
        `${this.baseUrl}/message/sms/send`,
        {
          mobile_phone: phone,
          message: 'Bu Eskiz dan test',
          from: '4546',
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );
    } catch (error) {
      //   await this.auth();
      //   await this.sendSMS(message, phone);
      return new BadRequestException(error.message);
    }
  }
}
