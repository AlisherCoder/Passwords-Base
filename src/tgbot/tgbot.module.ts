import { Module } from '@nestjs/common';
import { TgbotService } from './tgbot.service';
import { EskizService } from 'src/eskiz/eskiz.service';

@Module({
  providers: [TgbotService, EskizService]
})
export class TgbotModule {}
