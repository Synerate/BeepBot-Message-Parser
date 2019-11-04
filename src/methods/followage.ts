import * as config from 'config';
import * as countdown from 'countdown';
import * as moment from 'moment';

import { IMessage } from '../interface';
import { httpRequest } from '../lib/helpers';

export const methods = {
    mixer: async (request: typeof fetch, channelId: number, userId: number): Promise<string> => {
        const req = await httpRequest(request,
                                      `${config.get<string>('providers.mixer.api')}channels/${channelId}/relationship?user=${userId}`,
                                      { 'Client-ID': config.get<string>('providers.mixer.clientId') });
        if (req == null) {
            return '[API Error]';
        }
        if (req.status.follows == null) {
            return '[User Not Following]';
        }

        return countdown(new Date(), moment(req.status.follows.createdAt).toDate()).toString();
    },
    twitch: async (request: typeof fetch, channelId: string, userId: string): Promise<string> => {
        const req = await httpRequest(request,
                                      `${config.get<string>('providers.twitch.api')}helix/users/follows?from_id=${userId}&to_id=${channelId}`,
                                      { 'Client-ID': config.get<string>('providers.twitch.clientId') });
        if (req == null) {
            return '[API Error]';
        }
        if (req.total === 0 || req.data.length === 0) {
            return '[User Not Following]';
        }

        return countdown(new Date(), moment(req.data[0].followed_at).toDate()).toString();
    },
};

export async function followage(message: IMessage, _settings: undefined, request: typeof fetch) {
    if (methods[message.provider.toLowerCase()] == null) {
        return '[API Error]';
    }

    return methods[message.provider.toLowerCase()](request, message.channel.id, message.user.id);
}
