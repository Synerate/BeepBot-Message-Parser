import * as config from 'config';
import * as countdown from 'countdown';
import * as moment from 'moment';

import { IMessage } from '../interface';
import { httpRequest } from '../lib/helpers';

export const methods = {
    mixer: async (request: typeof fetch, channelId: number, userId: number): Promise<any> => {
        const req = await httpRequest(request,
                                      `${config.get<string>('providers.mixer.api')}channels/${channelId}/relationship?user=${userId}`,
                                      { 'Client-ID': config.get<string>('providers.mixer.clientId') });
        if (req.status.follows == null) {
            return 'User does not follow the channel.';
        }

        return countdown(new Date(), moment(req.status.follows.createdAt).toDate());
    },
};

export async function followage(message: IMessage, _settings: undefined, request: typeof fetch) {
    if (methods[message.provider.toLowerCase()] == null) {
        return '[API Error]';
    }

    return methods[message.provider.toLowerCase()](request, message.channel.id, message.user.id);
}
