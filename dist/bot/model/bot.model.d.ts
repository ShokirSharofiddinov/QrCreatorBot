import { Model } from 'sequelize-typescript';
interface BotAttr {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    status: boolean;
    is_active: boolean;
}
export declare class Bot extends Model<Bot, BotAttr> {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    status: boolean;
}
export {};
