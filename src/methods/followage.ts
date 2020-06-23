import * as config from 'config';
import * as countdown from 'countdown';
import * as moment from 'moment';

import { Parser } from '..';
import { IMessage } from '../interface';

export const methods = {
    twitch: async (parser: Parser, channelId: string, userId: string): Promise<string> => {
        const res = await parser.opts.reqCallback(`${config.get<string>('providers.twitch.api')}helix/users/follows?from_id=${userId}&to_id=${channelId}`, 'GET');
        if (res == null) {
            return '[API Error]';
        }

        if (res.total === 0 || res.data.length === 0) {
            return '[User Not Following]';
        }

        return countdown(new Date(), moment(res.data[0].followed_at).toDate()).toString();
    },
};

export async function followage(this: Parser, message: IMessage) {
    if (methods[message.provider.toLowerCase()] == null) {
        return '[Not Supported]';
    }

    return methods[message.provider.toLowerCase()](this, message.channel.id, message.user.id);
}
