import 'source-map-support/register';

import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import * as MagicString from 'magic-string';

import { parser } from './compiler/parser';
import { tokenizer } from './compiler/tokenizer';
import { IExpression, transformer } from './compiler/transformer';
import { IMessage } from './interface/message';
import { ISetting } from './interface/settings';
import { methods } from './methods';

/**
 * Handle an expression and return the generated value to be replaced.
 */
async function handle(cache: typeof fetch, message: IMessage, settings: ISetting, text: string, args: string[] = []): Promise<string> {
    return await methods[text.toLowerCase()](message, settings, cache, ...args);
}

/**
 * Run a expression by handling it and returning the generated value.
 *
 * Not all expressions need to be ran to a method so return the expression value.
 */
async function run(cache: typeof fetch, message: IMessage, settings: ISetting, expr: IExpression) {
    if (expr.type === 'String') {
        return expr.value;
    }
    if (expr.arguments.length === 0) {
        return await handle(cache, message, settings, expr.callee.name);
    }

    const args = await Promise.all(expr.arguments.map(arg => run(cache, message, settings, arg)));
    return await handle(cache, message, settings, expr.callee.name, args);
}

/**
 * Parse the text given to return the parsed generated outputs.
 *
 * This takes data from the message arg (ChannelMessage) from backend. To create
 * some data otherwise the parsers hits various APIs to get the data needed.
 */
export async function parse(message: IMessage, settings: ISetting, text: string) {
    const token = tokenizer(text);
    const parsed = parser(token);
    const transform = transformer(parsed);
    const original = new MagicString(text);
    let request = (<any> memoize)(fetch);

    // tslint:disable-next-line:prefer-const
    for (let i = 0, length = transform.body.length; i < length; i++) {
        const part = transform.body[i];
        if (part.type !== 'ExpressionStatement' || methods[part.expression.callee.name] == null) {
            continue;
        }

        const res = await run(request, message, settings, part.expression);
        original.overwrite(part.start, part.end, res);
    }

    // GC
    request = null;

    return original.toString();
}
