import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { Bot } from './model/bot.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forFeature([Bot])
  ],
  providers: [BotService, BotController],
  exports: [BotService]
})
export class BotModule {}
