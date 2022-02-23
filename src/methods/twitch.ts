import { get } from 'lodash';

import { Parser } from '../';
import { IMessage, ISetting } from '../interface';
import { getFromSimple, isValueValid } from '../lib/helpers';

export async function twitch(this: Parser, message: IMessage, _settings: ISetting, _request: never, type: string, channel = message.channel.id) {
    let channelId: string = channel.toString();

    if (isNaN(Number(channel))) {
        const resTwitchUsr = await this.opts.reqCallback(`https://api.twitch.tv/helix/users?login=${channel}`, {
            coreId: message.channel.coreId,
            method: 'GET',
            serviceId: message.channel.serviceId,
        });
        if (resTwitchUsr == null) {
            return '[API Error]';
        }
        if (resTwitchUsr.data == null || resTwitchUsr.data.length < 1) {
            return '[Invalid User]';
        }

        channelId = resTwitchUsr.data[0].id;
    }

    const res = await this.opts.reqCallback(`https://api.twitch.tv/helix/channels?broadcaster_id=${channelId}`, {
        coreId: message.channel.coreId,
        method: 'GET',
        serviceId: message.channel.serviceId,
    });
    if (res == null || res.data.length < 1) {
        return '[API Error]';
    }

    const value = get(res.data[0], getFromSimple('twitch', type), '[Type Not Found]');
    if (!isValueValid(value)) {
        return '[Return Value Invalid]';
    }

    return value;
}
