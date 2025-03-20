import { Injectable, OnModuleInit } from '@nestjs/common';
import { EskizService } from 'src/eskiz/eskiz.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scenes, Telegraf } from 'telegraf';

type Context = Scenes.SceneContext;
@Injectable()
export class TgbotService implements OnModuleInit {
  private bot: Telegraf<Context>;
  constructor(
    private prisma: PrismaService,
    private eskiz: EskizService,
  ) {
    this.bot = new Telegraf('7795971358:AAEH-8HOIP7_JTUUsJtz52iEgdUnlNSG2aM');
  }

  onModuleInit() {
    this.bot.start(async (ctx) => await this.onStart(ctx));
    this.bot.command('mydata', async (ctx) => await this.showMe(ctx));
    this.bot.command('sendsms', async (ctx) => await this.SendSms(ctx));
    this.bot.launch();
  }

  private async onStart(ctx: Context) {
    let tgUser = ctx.from;
    let user = await this.prisma.user.findFirst({
      where: { email: String(tgUser?.id) },
    });
    if (user) {
      await ctx.reply('You already exists');
      return;
    }
    let newUser = {
      name: ctx.from!.first_name,
      image: 'image.jpg',
      email: String(ctx.from?.id),
      password: '1234',
    };
    await this.prisma.user.create({ data: newUser });
    await ctx.reply('Your data saved');
  }

  private async showMe(ctx: Context) {
    let user = await this.prisma.user.findFirst({
      where: { email: String(ctx.from?.id) },
    });

    let info = `name: ${user?.name} email: ${user?.email}`;

    await ctx.reply(info);
  }

  private async SendSms(ctx: Context) {
    // await this.eskiz.sendSMS('salom', '+998953901313');
    ctx.reply('Sent sms');
  }
}
