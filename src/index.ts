import 'source-map-support/register';

import * as MagicString from 'magic-string';

import { parser } from './compiler/parser';
import { tokenizer } from './compiler/tokenizer';
import { IExpression, transformer } from './compiler/transformer';
import { IMessage } from './interface/message';
import { methods } from './methods';

/**
 * Handle an expression and return the generated value to be replaced.
 */
async function handle(message: IMessage, settings: any, text: string, args: string[] = []): Promise<string> {
    return await methods[text.toLowerCase()](message, settings, ...args);
}

async function run(message: IMessage, settings: any, expr: IExpression) {
    if (expr.type === 'String') {
        return expr.value;
    }
    if (expr.arguments.length === 0) {
        return await handle(message, settings, expr.callee.name);
    }

    const args = await Promise.all(expr.arguments.map(arg => run(message, settings, arg)));
    return await handle(message, settings, expr.callee.name, args);
}

/**
 * Parse the text given to return the parsed generated outputs.
 *
 * This takes data from the message arg (ChannelMessage) from backend. To create
 * some data otherwise the parsers hits various APIs to get the data needed.
 */
export async function parse(message: IMessage, settings: any, text: string) {
    const token = tokenizer(text);
    const parsed = parser(token);
    const transform = transformer(parsed);
    const original = new MagicString(text);

    // tslint:disable-next-line:prefer-const
    for (let i = 0, length = transform.body.length; i < length; i++) {
        const part = transform.body[i];
        if (part.type !== 'ExpressionStatement') {
            continue;
        }

        const res = await run(message, settings, part.expression);
        original.overwrite(part.start, part.end, res);
    }
    return original.toString();
}
