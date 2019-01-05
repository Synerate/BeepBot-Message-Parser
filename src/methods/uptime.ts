import * as config from 'config';
import * as moment from 'moment';
// tslint:disable-next-line:no-import-side-effect
import 'moment-countdown';

import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';

const providers = {
    /**
     * Get the uptime for a Mixer channel.
     */
    mixer: async (request: typeof fetch, channelId: string | number) => {
        const req = await httpRequest(request, `${config.get<string>('providers.mixer.api')}channels/${channelId}/manifest.light2`);
        if (req === undefined) {
            return '[Channel Offline]';
        }

        return moment(req.startedAt)
            .countdown(new Date())
            .toString();
    },
    /**
     * Get the uptime for a Smashcash channel.
     */
    smashcash: async (request: typeof fetch, channelId: string | number) => {
        const req = await httpRequest(request, `${config.get<string>('providers.smashcast.api')}media/live/${channelId}`);
        if (req === undefined || req.error === true) {
            return '[Channel Offline]';
        }

        return moment(req.livestream[0].media_live_since)
            .countdown(new Date())
            .toString();
    },
    /**
     * Get the uptime for a Twitch channel.
     */
    twitch: async (request: typeof fetch, channelId: string | number) => {
        const headers = {
            Accept: config.get<string>('providers.twitch.version'),
            'Client-ID': config.get<string>('providers.twitch.clientId'),
        };
        const req = await httpRequest(request, `${config.get<string>('providers.twitch.api')}streams/${channelId}`, headers);
        if (req === undefined || req.stream === undefined) {
            return '[Channel Offline]';
        }

        return moment(req.stream.created_at)
            .countdown(new Date())
            .toString();
    },
};

/**
 * Get the current uptime for a channel given on a provider.
 *
 * @Optional: Accepts a channel Id to check. Needs to match the ID for the provider which the command is ran from.
 */
export function uptime(message: IMessage, _settings: ISetting, request: typeof fetch, channelId: string | number = message.channel.id) {
    if (providers[message.provider.toLowerCase()] === undefined) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.toLowerCase()](request, channelId);
}
