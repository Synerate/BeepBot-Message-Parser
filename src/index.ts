import 'source-map-support/register';

import * as fetch from 'isomorphic-fetch';
import MagicString from 'magic-string';
import { memoize } from 'memoize-lit';

import { parser } from './compiler/parser';
import { tokenizer } from './compiler/tokenizer';
import { IExpression, transformer } from './compiler/transformer';
import { IMessage, ISetting } from './interface';
import { methods } from './methods';
import { Middleware } from './middleware';

export { VarType } from './methods/variable';

/**
 * Allowed methods which can be used with repeatables.
 *
 * As repeatables are a special case, they should only be allowed to use a limited set of methods.
 */
const REPEAT_WHITELIST = [
    'query',
    'randomnum',
    'add',
    'incr',
    'arg',
    'randlist',
    'listpick',
    'time',
    'user',
    'touser',
    'userid',
];

export class Parser {
    constructor(public middleware: Middleware = {}) {
        if (middleware?.onServiceAPI) {
            this.middleware.onServiceAPI = memoize(middleware.onServiceAPI, { maxAge: 60000 }); // 1 minute memoize
        }
    }

    /**
     * Parse the text given to return the parsed generated outputs.
     *
     * This takes data from the message arg (ChannelMessage) from backend. To create
     * some data otherwise the parsers hits various APIs to get the data needed.
     */
    public async parse(message: IMessage, settings: ISetting, text: string) {
        const token = tokenizer(text);
        const parsed = parser(token);
        const transform = transformer(parsed);
        const original = new MagicString(text);
        let request = memoize(fetch);

        for (let i = 0, length = transform.body.length; i < length; i++) {
            const part = transform.body[i];

            // Handle repeat.
            if (part.type === 'ExpressionStatement' && String(part.expression.callee.name).toLowerCase() === 'repeat' && part.expression.callee.type === 'Identifier') {
                const res = await this.handleRepeat(request, message, settings, part.expression);
                original.overwrite(part.start, part.end, res.toString());

                continue;
            }

            if (part.type !== 'ExpressionStatement' || methods[part.expression.callee.name.toLowerCase()] === undefined) {
                continue;
            }

            const res = await this.run(request, message, settings, part.expression);
            original.overwrite(part.start, part.end, res.toString());
        }

        // GC
        request = undefined;

        return original.toString();
    }

    /**
     * Run a expression by handling it and returning the generated value.
     *
     * Not all expressions need to be ran to a method so return the expression value.
     */
    private async run(cache: typeof fetch, message: IMessage, settings: ISetting, expr: IExpression, isRepeat: boolean = false): Promise<string> {
        if (expr.type === 'String') {
            return expr.value;
        }
        if (expr.arguments.length === 0) {
            return this.handle(cache, message, settings, expr.callee.name, [], isRepeat);
        }

        const args = await Promise.all(expr.arguments.map(arg => {
            if (arg?.callee?.name?.toLowerCase() === 'repeat') {
                return this.handleRepeat(cache, message, settings, arg);
            }

            return this.run(cache, message, settings, arg, isRepeat);
        }));

        return this.handle(cache, message, settings, expr.callee.name, args, isRepeat);
    }

    /**
     * Handle an expression and return the generated value to be replaced.
     */
    private async handle(cache: typeof fetch, message: IMessage, settings: ISetting, text: string, args: string[] = [], isRepeat: boolean): Promise<string> {
        if (methods[text.toLowerCase()] == null) {
            return;
        }

        if (isRepeat && !REPEAT_WHITELIST.includes(text.toLowerCase())) {
            return;
        }

        return methods[text.toLowerCase()].call(this, message, settings, cache, ...args);
    }

    private async handleRepeat(cache: typeof fetch, message: IMessage, settings: ISetting, expr: IExpression): Promise<string> {
        const MAX_REPEATS = 5;
        let TO_REPEAT = MAX_REPEATS;

        const repeatArgs = [ ...expr.arguments ].pop();
        if (repeatArgs.type === 'String') {
            const userValue = Number(repeatArgs.value);
            if (!isNaN(userValue) && userValue <= MAX_REPEATS) {
                TO_REPEAT = userValue;
            }
        } else if (repeatArgs.type === 'CallExpression') {
            const res = await this.run(cache, message, settings, repeatArgs, true);

            const userValue = Number(res);
            if (!isNaN(userValue) && userValue <= MAX_REPEATS) {
                TO_REPEAT = userValue;
            }
        }

        const results: string[] = [];

        for (let i = 0; i < TO_REPEAT; i++) {
            const res = await this.run(cache, message, settings, expr.arguments[0], true);
            if (res != null) {
                results.push(res);
            }
        }

        return results.toString();
    }
}
