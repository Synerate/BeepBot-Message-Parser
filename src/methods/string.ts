import * as _ from 'lodash';
import { random } from 'lodash';

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

export function incr(_message: IMessage, _settings: ISetting, _request: typeof fetch, base: string, val: string) {
    if (isNaN(Number(base)) || isNaN(Number(val))) {
        return '[Base or Val needs to be a number]';
    }

    return `${Number(base) + Number(val)}`;
}

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

export function randlist(_message: IMessage, _settings: ISetting, _request: typeof fetch, ...str: string[]) {
    if (str == null || str.length < 1) {
        return;
    }

    const list = str.join(' ').split(';');
    if (list == null || list.length < 1) {
        return '';
    }

    return _(list).shuffle().shuffle().sampleSize(1);
}
export const listpick = randlist;
