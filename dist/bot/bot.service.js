"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const bot_model_1 = require("./model/bot.model");
const sequelize_1 = require("@nestjs/sequelize");
const app_constants_1 = require("../app.constants");
const nestjs_telegraf_1 = require("nestjs-telegraf");
let BotService = class BotService {
    constructor(botRepo, bot) {
        this.botRepo = botRepo;
        this.bot = bot;
        this.awaitingInputSessions = {};
    }
    async start(ctx) {
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
                ...telegraf_1.Markup.keyboard([
                    [telegraf_1.Markup.button.contactRequest('Send Phone Number')],
                ])
                    .oneTime()
                    .resize(),
            });
        }
        else if (!user.status) {
            await ctx.reply(`Please press the "Send Phone Number" button!`, {
                parse_mode: 'HTML',
                ...telegraf_1.Markup.keyboard([
                    [telegraf_1.Markup.button.contactRequest('Send Phone Number')],
                ])
                    .oneTime()
                    .resize(),
            });
        }
        else {
            await this.bot.telegram.sendChatAction(userId, 'typing');
            await ctx.reply('This bot creates QR codes', {
                parse_mode: 'HTML',
                ...telegraf_1.Markup.removeKeyboard(),
            });
        }
    }
    async onContact(ctx) {
        if ('contact' in ctx.message) {
            const userId = ctx.from.id;
            const user = await this.botRepo.findOne({
                where: { user_id: userId },
            });
            if (!user) {
                ctx.reply(`Please press the Start button!`, {
                    parse_mode: 'HTML',
                    ...telegraf_1.Markup.keyboard([['/start']])
                        .oneTime()
                        .resize(),
                });
            }
            else if (ctx.message.contact.user_id != userId) {
                await ctx.reply('Please enter your own phone number', {
                    parse_mode: 'HTML',
                    ...telegraf_1.Markup.keyboard([
                        [telegraf_1.Markup.button.contactRequest('Send Phone Number')],
                    ])
                        .oneTime()
                        .resize(),
                });
            }
            else {
                let phone;
                ctx.message.contact.phone_number[0] == '+'
                    ? (phone = ctx.message.contact.phone_number)
                    : (phone = '+' + ctx.message.contact.phone_number);
                await this.botRepo.update({
                    phone_number: phone,
                    status: true,
                }, {
                    where: { user_id: userId },
                });
                await ctx.reply(`Congratulations, you've successfully registered!\nNow you can create QR codes just send text or link`, {
                    parse_mode: 'HTML',
                    ...telegraf_1.Markup.removeKeyboard(),
                });
            }
        }
    }
    async onStop(ctx) {
        const userId = ctx.from.id;
        const user = await this.botRepo.findOne({
            where: { user_id: userId },
        });
        if (user.status) {
            await this.botRepo.update({
                status: false,
                phone_number: null,
            }, { where: { user_id: userId } });
        }
        await ctx.reply(`You have unsubscribed from the bot`, {
            parse_mode: 'HTML',
            ...telegraf_1.Markup.keyboard([['/start']])
                .oneTime()
                .resize(),
        });
    }
    async handleIncomingMessage(ctx) {
        const text = ctx.message.text;
        console.log(typeof text);
        if (typeof text == 'string') {
            const input = text;
            console.log(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(input));
            if (/^[a-zA-Z0-9]+$/.test(input) ||
                /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(input)) {
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(input)}`;
                await this.bot.telegram.sendPhoto(ctx.message.from.id, qrCodeUrl, {
                    caption: 'Here is your QR code!',
                });
                this.awaitingInputSessions[ctx.from.id] = false;
            }
            else {
                await this.sendTelegramMessage(ctx.message.from.id, 'Invalid input. Please enter only text or numbers.');
            }
        }
        else {
            const messageType = this.getMessageType(ctx.message);
            if (messageType === 'unsupported') {
                await this.sendTelegramMessage(ctx.message.from.id, 'Unsupported message type. Please send only String messages.');
            }
            else {
                await this.sendTelegramMessage(ctx.message.from.id, `Unsupported message type: ${messageType}. Only string!!`);
            }
        }
    }
    getMessageType(message) {
        console.log(message);
        if (message.text) {
            return 'text';
        }
        else if (message.photo) {
            return 'photo';
        }
        else if (message.sticker) {
            return 'sticker';
        }
        else if (message.document) {
            return 'document';
        }
        else if (message.video) {
            return 'video';
        }
        else if (message.audio) {
            return 'audio';
        }
        else if (message.animation) {
            return 'animation';
        }
        else if (message.voice) {
            return 'voice';
        }
        else if (message.video_note) {
            return 'video_note';
        }
        else if (message.number) {
            return 'number';
        }
        else {
            return 'unsupported';
        }
    }
    sendTelegramMessage(chatId, text) {
        this.bot.telegram.sendMessage(chatId, text);
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(bot_model_1.Bot)),
    __param(1, (0, nestjs_telegraf_1.InjectBot)(app_constants_1.BOT_NAME)),
    __metadata("design:paramtypes", [Object, telegraf_1.Telegraf])
], BotService);
//# sourceMappingURL=bot.service.js.map