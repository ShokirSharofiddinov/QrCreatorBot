import { Injectable } from '@nestjs/common';
import { Telegraf, Markup, Context } from 'telegraf';
import { Bot } from './model/bot.model';
import { InjectModel } from '@nestjs/sequelize';
import { BOT_NAME } from '../app.constants';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class BotService {
  private awaitingInputSessions: Record<number, boolean> = {};
  constructor(
    @InjectModel(Bot) private botRepo: typeof Bot,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
  ) {}

  async start(ctx: Context) {
    const userId = ctx.from.id;

    const user = await this.botRepo.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      await this.botRepo.create({
        user_id: userId,
        first_name: ctx.from.first_name,
        last_name: ctx.from.last_name,
        username: ctx.from.username,
      });
      await ctx.reply(`Please press the "Send Phone Number" button!`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          [Markup.button.contactRequest('Send Phone Number')],
        ])
          .oneTime()
          .resize(),
      });
    } else if (!user.status) {
      await ctx.reply(`Please press the "Send Phone Number" button!`, {
        parse_mode: 'HTML',
        ...Markup.keyboard([
          [Markup.button.contactRequest('Send Phone Number')],
        ])
          .oneTime()
          .resize(),
      });
    } else {
      await this.bot.telegram.sendChatAction(userId, 'typing');
      await ctx.reply(
        'This bot creates QR codes',
        {
          parse_mode: 'HTML',
          ...Markup.removeKeyboard(),
        },
      );
    }
  }

  async onContact(ctx: Context) {
    if ('contact' in ctx.message) {
      const userId = ctx.from.id;
      const user = await this.botRepo.findOne({
        where: { user_id: userId },
      });
      if (!user) {
        ctx.reply(`Please press the Start button!`, {
          parse_mode: 'HTML',
          ...Markup.keyboard([['/start']])
            .oneTime()
            .resize(),
        });
      } else if (ctx.message.contact.user_id != userId) {
        await ctx.reply('Please enter your own phone number', {
          parse_mode: 'HTML',
          ...Markup.keyboard([
            [Markup.button.contactRequest('Send Phone Number')],
          ])
            .oneTime()
            .resize(),
        });
      } else {
        let phone: string;
        ctx.message.contact.phone_number[0] == '+'
          ? (phone = ctx.message.contact.phone_number)
          : (phone = '+' + ctx.message.contact.phone_number);
        await this.botRepo.update(
          {
            phone_number: phone,
            status: true,
          },
          {
            where: { user_id: userId },
          },
        );
        await ctx.reply(
          `Congratulations, you've successfully registered!\nNow you can create QR codes just send text or link`,
          {
            parse_mode: 'HTML',
            ...Markup.removeKeyboard(),
          },
        );
      }
    }
  }

  async onStop(ctx: Context) {
    const userId = ctx.from.id;
    const user = await this.botRepo.findOne({
      where: { user_id: userId },
    });

    if (user.status) {
      await this.botRepo.update(
        {
          status: false,
          phone_number: null,
        },
        { where: { user_id: userId } },
      );
    }
    await ctx.reply(`You have unsubscribed from the bot`, {
      parse_mode: 'HTML',
      ...Markup.keyboard([['/start']])
        .oneTime()
        .resize(),
    });
  }

  async handleIncomingMessage(
    ctx: Context & { message: { text?: string } },
  ): Promise<void> {
    const text = ctx.message.text;
    console.log(typeof text);
    if (typeof text == 'string') {
      const input = text;
      console.log(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(input));
      if (
        /^[a-zA-Z0-9]+$/.test(input) ||
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(
          input,
        )
      ) {
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
          input,
        )}`;
        await this.bot.telegram.sendPhoto(ctx.message.from.id, qrCodeUrl, {
          caption: 'Here is your QR code!',
        });
        this.awaitingInputSessions[ctx.from.id] = false;
      } else {
        await this.sendTelegramMessage(
          ctx.message.from.id,
          'Invalid input. Please enter only text or numbers.',
        );
      }
    } else {
      const messageType = this.getMessageType(ctx.message);
      if (messageType === 'unsupported') {
        await this.sendTelegramMessage(
          ctx.message.from.id,
          'Unsupported message type. Please send only String messages.',
        );
      } else {
        await this.sendTelegramMessage(
          ctx.message.from.id,
          `Unsupported message type: ${messageType}. Only string!!`,
        );
      }
    }
  }

  private getMessageType(message: any): string {
    console.log(message);
    if (message.text) {
      return 'text';
    } else if (message.photo) {
      return 'photo';
    } else if (message.sticker) {
      return 'sticker';
    } else if (message.document) {
      return 'document';
    } else if (message.video) {
      return 'video';
    } else if (message.audio) {
      return 'audio';
    } else if (message.animation) {
      return 'animation';
    } else if (message.voice) {
      return 'voice';
    } else if (message.video_note) {
      return 'video_note';
    } else if (message.number) {
      return 'number';
    } else {
      return 'unsupported';
    }
  }

  private sendTelegramMessage(chatId: number, text: string): void {
    this.bot.telegram.sendMessage(chatId, text);
  }
}
