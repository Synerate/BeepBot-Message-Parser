import * as config from 'config';
import { get } from 'lodash';

import { Parser } from '..';
import { IMessage, ISetting } from '../interface';
import { getFromSimple, isValueValid } from '../lib/helpers';

export async function twitch(this: Parser, message: IMessage, _settings: ISetting, _request: never, type: string, channel = message.channel.id) {
    const res = await this.opts.reqCallback(`${config.get<string>('providers.twitch.api')}kraken/channels/${channel}`, 'GET', message.channel.coreId);
    if (res == null) {
        return '[API Error]';
    }

    const value = get(res, getFromSimple('twitch', type), '[Type Not Found]');
    if (!isValueValid(value)) {
        return '[Return Value Invalid]';
    }

    return value;
}
