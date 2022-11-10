import { chain, random } from 'lodash';

import { IMessage, ISetting } from '../interface';

export function query(message: IMessage) {
    return message.message.args.slice(1)
        .join(' ');
}

export function randomnum(_message: IMessage, _settings: ISetting, _request: typeof fetch, min: string, max: string) {
    if (isNaN(Number(min)) || isNaN(Number(max))) {
        return '[Min or Max needs to be a number]';
    }
    if (Number(min) === 0 || Number(max) === 0) {
        return '[Min or Max needs to be more than 0]';
    }
    if (Number(min) > Number(max)) {
        return '[Min should not be more than the Max]';
    }

    return random(Number(min), Number(max))
        .toString();
}

export function add(_message: IMessage, _settings: ISetting, _request: typeof fetch, ...numbers: string[]) {
    if (numbers == null || numbers.length > 10) {
        return '[Invalid number of arguments]';
    }

    return numbers
        .map(n => n.split(','))
        .flat()
        .map(Number)
        .filter((n) => !isNaN(n))
        .reduce((a, b) => a + b);
}

export const incr = add;

export function arg(message: IMessage, _settings: ISetting, _request: typeof fetch, index: string) {
    if (isNaN(Number(index))) {
        return '[Index is not a number]';
    }

    const hasArg = message.message.args[Number(index)];
    if (hasArg == null) {
        return '';
    }

    return hasArg;
}

export function urlencode(_message: IMessage, _settings: ISetting, _request: typeof fetch, str: string) {
    return encodeURIComponent(str);
}

export function urldecode(_message: IMessage, _settings: ISetting, _request: typeof fetch, str: string) {
    return decodeURIComponent(str);
}

export function randlist(_message: IMessage, _settings: ISetting, _request: typeof fetch, ...str: string[]) {
    if (str == null || str.length < 1) {
        return;
    }

    const list = str.join(' ').split(';');
    if (list == null || list.length < 1) {
        return '';
    }

    return chain(list)
        .shuffle()
        .shuffle()
        .sampleSize(1);
}

export const listpick = randlist;
