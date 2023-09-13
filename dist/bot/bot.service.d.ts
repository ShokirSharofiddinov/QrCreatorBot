import { Telegraf, Context } from 'telegraf';
import { Bot } from './model/bot.model';
export declare class BotService {
    private botRepo;
    private readonly bot;
    private awaitingInputSessions;
    constructor(botRepo: typeof Bot, bot: Telegraf<Context>);
    start(ctx: Context): Promise<void>;
    onContact(ctx: Context): Promise<void>;
    onStop(ctx: Context): Promise<void>;
    handleIncomingMessage(ctx: Context & {
        message: {
            text?: string;
        };
    }): Promise<void>;
    private getMessageType;
    private sendTelegramMessage;
}
