import * as config from 'config';
import { get } from 'lodash';

import { Parser } from '..';
import { IMessage, ISetting } from '../interface';
import { getFromSimple, isValueValid } from '../lib/helpers';

export async function twitch(this: Parser, message: IMessage, _settings: ISetting, _request: never, type: string, channel = message.channel.id) {
    let channelId: string = channel.toString();

    if (isNaN(Number(channel))) {
        const resTwitchUsr = await this.opts.reqCallback(`https://api.twitch.tv/kraken/users?login=${channel}`, {
            coreId: message.channel.coreId,
            method: 'GET',
            serviceId: message.channel.serviceId,
        });
        if (resTwitchUsr == null) {
            return '[API Error]';
        }

        channelId = resTwitchUsr.users[0]._id;
    }

    const res = await this.opts.reqCallback(`${config.get<string>('providers.twitch.api')}kraken/channels/${channelId}`, {
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
