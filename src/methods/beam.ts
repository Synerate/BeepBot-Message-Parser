import * as config from 'config';

import { IMessage } from '../interface/message';
import { ISetting } from '../interface/settings';
import { request } from '../lib/helpers';

export async function beam(message: IMessage, settings: ISetting, type: string, channel: string | number = message.channel.id) {
    const req = await request(`${config.get<string>('providers.beam.api')}channels/${channel}`);
    if (req == null || !(type in req)) {
        return '[Invalid Type]';
    }
    return req[type];
}
