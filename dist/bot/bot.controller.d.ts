import { Context } from 'telegraf';
import { BotService } from './bot.service';
export declare class BotController {
    private readonly botService;
    constructor(botService: BotService);
    onStart(ctx: Context): Promise<void>;
    onContact(ctx: Context): Promise<void>;
    onStop(ctx: Context): Promise<void>;
    onText(ctx: Context): Promise<void>;
    onText2(ctx: Context): Promise<void>;
    onText3(ctx: Context): Promise<void>;
    onText4(ctx: Context): Promise<void>;
    onText5(ctx: Context): Promise<void>;
    onText6(ctx: Context): Promise<void>;
}
