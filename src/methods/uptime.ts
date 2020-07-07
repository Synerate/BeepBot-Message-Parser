import * as config from 'config';
import * as countdown from 'countdown';
import * as moment from 'moment';

import { Parser } from '..';
import { IMessage, ISetting } from '../interface';

const providers = {
    /**
     * Get the uptime for a Twitch channel.
     */
    twitch: async (parser: Parser, channelId: string | number, coreId: string, serviceId: string): Promise<any> => {
        const res = await parser.opts.reqCallback(`${config.get<string>('providers.twitch.api')}helix/streams?user_id=${channelId}`, {
            coreId,
            method: 'GET',
            serviceId,
        });
        if (res == null || res.data.length === 0) {
            return '[Channel Offline]';
        }

        return countdown(new Date(), moment(res.data[0].started_at).toDate());
    },
};

/**
 * Get the current uptime for a channel given on a provider.
 *
 * @Optional: Accepts a channel Id to check. Needs to match the ID for the provider which the command is ran from.
 */
export function uptime(this: Parser, message: IMessage, _settings: ISetting, _request: never, channelId: string | number = message.channel.id) {
    if (providers[message.provider.toLowerCase()] == null) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.toLowerCase()](this, channelId, message.channel.coreId, message.channel.serviceId);
}
