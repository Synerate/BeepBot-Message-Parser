import * as config from 'config';

import { IMessage } from '../interface/message';
import { request } from '../lib/helpers';

export async function beam(message: IMessage, settings: any, type: string, channel: string | number = message.channel.id) {
    const req = await request(`${config.get<string>('providers.beam.api')}channels/${channel}`);
    if (req == null || !(type in req)) {
        return '[Invalid Type]';
    }
    return req[type];
}
