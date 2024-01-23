import { chain, random } from 'lodash';
import { evaluate } from 'mathjs';

import { Parser, ParserContext } from '../';
import { IMessage, ISetting } from '../interface';

export const compile = (_message: IMessage, _settings: ISetting, _context: ParserContext, ...str: string[]) => str.join('');
export const query = (message: IMessage, _settings: ISetting, _ctx: ParserContext, skipIndex: number = 1) => message.message.args.slice(skipIndex).join(' ');
export const echo = query;

export function randomnum(_message: IMessage, _settings: ISetting, { cache }: ParserContext, min: string, max: string) {
    if (isNaN(Number(min)) || isNaN(Number(max))) {
        return '[Min or Max needs to be a number]';
    }
    if (Number(min) === 0 || Number(max) === 0) {
        return '[Min or Max needs to be more than 0]';
    }
    if (Number(min) > Number(max)) {
        return '[Min should not be more than the Max]';
    }

    const result = random(Number(min), Number(max));
    cache.push(result);

    return result.toString();
}
export const randint = randomnum;

export function add(_message: IMessage, _settings: ISetting, _context: ParserContext, ...numbers: string[]) {
    if (numbers == null || numbers.length > 10) {
        return '[Invalid number of arguments]';
    }

    const toHandle = numbers
        .map(n => n.split(','))
        .flat()
        .map(Number)
        .filter((n) => !isNaN(n));
    if (toHandle == null || toHandle.length < 1) {
        return '[No valid numbers to process]';
    }

    return toHandle.reduce((a, b) => a + b);
}

export const incr = add;

export function arg(message: IMessage, _settings: ISetting, _context: ParserContext, index: string) {
    if (isNaN(Number(index))) {
        return '[Index is not a number]';
    }

    const hasArg = message.message.args[Number(index)];
    if (hasArg == null) {
        return '';
    }

    return hasArg;
}

export const urlencode = (_message: IMessage, _settings: ISetting, _context: ParserContext, ...str: string[]) => encodeURIComponent(str.join(' '));
export const urldecode = (_message: IMessage, _settings: ISetting, _context: ParserContext, ...str: string[]) => decodeURIComponent(str.join(' '));

export async function randlist(this: Parser, _message: IMessage, _settings: ISetting, { cache }: ParserContext, ...str: string[]) {
    if (str == null || str.length < 1) {
        return;
    }

    const list = str.join(' ').split(';');
    if (list == null || list.length < 1) {
        return '';
    }

    const [ result ] = chain(list)
        .shuffle()
        .shuffle()
        .sampleSize(1)
        .valueOf();

    cache.push(result);

    return result;
}

export const listpick = randlist;
export const rngphrase = randlist;

export function math(_message: IMessage, _settings: ISetting, _context: ParserContext, ...str: string[]) {
    if (str == null || str.length < 1) {
        return;
    }

    const expression = str.join(' ');
    try {
        return evaluate(expression);
    } catch (e) {
        return '[Error: Invalid Expression]';
    }
}
