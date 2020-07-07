import * as config from 'config';
import { get } from 'lodash';

import { Parser } from '..';
import { IMessage, ISetting } from '../interface';
import { getFromSimple, isValueValid } from '../lib/helpers';

export async function twitch(this: Parser, message: IMessage, _settings: ISetting, _request: never, type: string, channel = message.channel.id) {
    const resTwitchUsr = await this.opts.reqCallback(`${config.get<string>('providers.twitch.api')}kraken/users?login=${channel}`, {
        coreId: message.channel.coreId,
        method: 'GET',
        serviceId: message.channel.serviceId,
    });
    if (resTwitchUsr == null || resTwitchUsr.users == null || resTwitchUsr.users.length === 0) {
        return '[API Error]';
    }
    const twitchId = resTwitchUsr.users[0]._id;

    const res = await this.opts.reqCallback(`${config.get<string>('providers.twitch.api')}kraken/channels/${twitchId}`, {
        coreId: message.channel.coreId,
        method: 'GET',
        serviceId: message.channel.serviceId,
    });
    if (res == null) {
        return '[API Error]';
    }

    const value = get(res, getFromSimple('twitch', type), '[Type Not Found]');
    if (!isValueValid(value)) {
        return '[Return Value Invalid]';
    }

    return value;
}
