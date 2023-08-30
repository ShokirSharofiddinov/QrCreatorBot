import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { Update, Ctx, On, Start, Command } from 'nestjs-telegraf';
import { BotService } from './bot.service';

@Injectable()
@Update()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    return this.botService.start(ctx);
  }

  @On('contact')
  async onContact(@Ctx() ctx: Context) {
    return this.botService.onContact(ctx);
  }

  @Command('stop')
  async onStop(@Ctx() ctx: Context) {
    return this.botService.onStop(ctx);
  }

  @On('text')
  async onText(@Ctx() ctx: Context) {
    if (ctx.message) {
      return this.botService.handleIncomingMessage(ctx);
    }
  }

  @On('sticker')
  async onText2(@Ctx() ctx: Context) {
    if (ctx.message) {
      return this.botService.handleIncomingMessage(ctx);
    }
  }

  @On('audio')
  async onText3(@Ctx() ctx: Context) {
    if (ctx.message) {
      return this.botService.handleIncomingMessage(ctx);
    }
  }

  @On('video')
  async onText4(@Ctx() ctx: Context) {
    if (ctx.message) {
      return this.botService.handleIncomingMessage(ctx);
    }
  }

  @On('photo')
  async onText5(@Ctx() ctx: Context) {
    if (ctx.message) {
      return this.botService.handleIncomingMessage(ctx);
    }
  }

  @On('animation')
  async onText6(@Ctx() ctx: Context) {
    if (ctx.message) {
      return this.botService.handleIncomingMessage(ctx);
    }
  }
}
