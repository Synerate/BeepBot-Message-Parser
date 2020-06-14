import * as config from 'config';
import * as countdown from 'countdown';
import * as moment from 'moment';

import { IOpts } from '..';
import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';

const providers = {
    /**
     * Get the uptime for a Mixer channel.
     */
    mixer: async (request: typeof fetch, channelId: string | number): Promise<any> => {
        const req = await httpRequest(request, `${config.get<string>('providers.mixer.api')}channels/${channelId}/manifest.light2`);
        if (req === undefined) {
            return '[Channel Offline]';
        }

        return countdown(new Date(), moment(req.startedAt).toDate());
    },
    /**
     * Get the uptime for a Smashcast channel.
     */
    smashcast: async (request: typeof fetch, channelId: string | number): Promise<any> => {
        const req = await httpRequest(request, `${config.get<string>('providers.smashcast.api')}media/live/${channelId}`);
        if (req === undefined || req.error === true) {
            return '[Channel Offline]';
        }
        if (req.livestream[0].media_live_since == null) {
            return '[Channel Offline]';
        }

        return countdown(new Date(), moment(req.livestream[0].media_live_since).toDate());
    },
    /**
     * Get the uptime for a Twitch channel.
     */
    twitch: async (request: typeof fetch, channelId: string | number, opts: IOpts['oauth']): Promise<any> => {
        const headers = {
            Authorization: `OAuth ${opts.twitch}`,
            'Client-ID': config.get<string>('providers.twitch.clientId'),
        };
        const req = await httpRequest(request, `${config.get<string>('providers.twitch.api')}helix/streams?user_id=${channelId}`, headers);
        if (req === undefined || req.data.length === 0) {
            return '[Channel Offline]';
        }

        return countdown(new Date(), moment(req.data[0].started_at).toDate());
    },
};

/**
 * Get the current uptime for a channel given on a provider.
 *
 * @Optional: Accepts a channel Id to check. Needs to match the ID for the provider which the command is ran from.
 */
export function uptime(message: IMessage, _settings: ISetting, request: typeof fetch, opts: IOpts['oauth'], channelId: string | number = message.channel.id) {
    if (providers[message.provider.toLowerCase()] === undefined) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.toLowerCase()](request, channelId, opts);
}
