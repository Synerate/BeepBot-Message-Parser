import { random } from 'lodash';

import { IMessage } from '../interface/message';
import { ISetting } from '../interface/settings';

export function query(message: IMessage) {
    return message.message.args.slice(1).join(' ');
}

export function randomnum(message: IMessage, settings: ISetting, request: typeof fetch, min: string, max: string) {
    if (isNaN(Number(min)) || isNaN(Number(max))) {
        return '[Min or Max needs to be a number]';
    }
    if (Number(min) === 0 || Number(max) === 0) {
        return '[Min or Max needs to be more than 0]';
    }
    if (Number(min) > Number(max)) {
        return '[Min should not be more than the Max]';
    }

    return random(Number(min), Number(max)).toString();
}
