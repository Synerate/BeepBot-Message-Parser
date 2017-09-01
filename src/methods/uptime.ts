import * as config from 'config';
import * as moment from 'moment';
// tslint:disable-next-line:no-import-side-effect
import 'moment-countdown';

import { IMessage } from '../interface/message';
import { ISetting } from '../interface/settings';
import { httpRequest } from '../lib/helpers';

const providers = {
    /**
     * Get the uptime for a Mixer channel.
     */
    mixer: async (request: typeof fetch, channelId: string | number) => {
        const req = await httpRequest(request, `${config.get<string>('providers.mixer.api')}channels/${channelId}/manifest.light2`);
        if (req == null) {
            return '[Channel Offline]';
        }

        return moment(req.startedAt).countdown(new Date()).toString();
    },
    /**
     * Get the uptime for a Smashcash channel.
     */
    smashcash: async (request: typeof fetch, channelId: string | number) => {
        const req = await httpRequest(request, `${config.get<string>('providers.smashcast.api')}media/live/${channelId}`);
        if (req == null || req.error === true) {
            return '[Channel Offline]';
        }

        return moment(req.livestream[0].media_live_since).countdown(new Date()).toString();
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
        if (req == null || req.stream == null) {
            return '[Channel Offline]';
        }

        return moment(req.stream.created_at).countdown(new Date()).toString();
    },
};

/**
 * Get the current uptime for a channel given on a provider.
 *
 * @Optional: Accepts a channel Id to check. Needs to match the ID for the provider which the command is ran from.
 */
export function uptime(message: IMessage, settings: ISetting, request: typeof fetch, channelId: string | number = message.channel.id) {
    if (providers[message.provider.type.toLowerCase()] == null) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.type.toLowerCase()](request, channelId);
}
