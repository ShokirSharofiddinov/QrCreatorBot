/**
 * Command handling.
 *
 * @see https://telegraf.js.org/#/?id=command
 */
export declare const Command: (...args: [string] | [RegExp] | [(value: string, ctx: never) => RegExpExecArray] | [(string | RegExp | ((value: string, ctx: never) => RegExpExecArray))[]]) => MethodDecorator;
