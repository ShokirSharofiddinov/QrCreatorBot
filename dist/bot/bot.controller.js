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
exports.BotController = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const bot_service_1 = require("./bot.service");
let BotController = class BotController {
    constructor(botService) {
        this.botService = botService;
    }
    async onStart(ctx) {
        return this.botService.start(ctx);
    }
    async onContact(ctx) {
        return this.botService.onContact(ctx);
    }
    async onStop(ctx) {
        return this.botService.onStop(ctx);
    }
    async onText(ctx) {
        if (ctx.message) {
            return this.botService.handleIncomingMessage(ctx);
        }
    }
    async onText2(ctx) {
        if (ctx.message) {
            return this.botService.handleIncomingMessage(ctx);
        }
    }
    async onText3(ctx) {
        if (ctx.message) {
            return this.botService.handleIncomingMessage(ctx);
        }
    }
    async onText4(ctx) {
        if (ctx.message) {
            return this.botService.handleIncomingMessage(ctx);
        }
    }
    async onText5(ctx) {
        if (ctx.message) {
            return this.botService.handleIncomingMessage(ctx);
        }
    }
    async onText6(ctx) {
        if (ctx.message) {
            return this.botService.handleIncomingMessage(ctx);
        }
    }
};
exports.BotController = BotController;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "onStart", null);
__decorate([
    (0, nestjs_telegraf_1.On)('contact'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "onContact", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('stop'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "onStop", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "onText", null);
__decorate([
    (0, nestjs_telegraf_1.On)('sticker'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "onText2", null);
__decorate([
    (0, nestjs_telegraf_1.On)('audio'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "onText3", null);
__decorate([
    (0, nestjs_telegraf_1.On)('video'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "onText4", null);
__decorate([
    (0, nestjs_telegraf_1.On)('photo'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "onText5", null);
__decorate([
    (0, nestjs_telegraf_1.On)('animation'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotController.prototype, "onText6", null);
exports.BotController = BotController = __decorate([
    (0, common_1.Injectable)(),
    (0, nestjs_telegraf_1.Update)(),
    __metadata("design:paramtypes", [bot_service_1.BotService])
], BotController);
//# sourceMappingURL=bot.controller.js.map