import * as config from 'config';
import * as countdown from 'countdown';
import * as moment from 'moment';

import { Parser } from '..';
import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';
import { IGlimeshRes } from './glimesh';

const providers = {
    glimesh: async (_parser: Parser, request: typeof fetch, channelId: string | number): Promise<string> => {
        const reqHeaders = {
            Authorization: `Client-ID ${config.get('providers.glimesh.clientId')}`,
        };
        const reqBody = `
            query {
                channel(id: ${channelId}) {
                    stream {
                        startedAt
                    }
                }
            }
        `;

        const req: IGlimeshRes = await httpRequest(request, config.get('providers.glimesh.api'), { headers: reqHeaders, method: 'POST', body: reqBody });
        if (req == null) {
            return '[API Error]';
        }
        if (req?.data?.channel?.stream === null) {
            return '[Channel Offline]';
        }

        return countdown(new Date(), moment(req.data.channel.stream.startedAt).toDate()).toString();
    },
    twitch: async (parser: Parser, _request: never, channelId: string | number, coreId: string, serviceId: string): Promise<any> => {
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
export function uptime(this: Parser, message: IMessage, _settings: ISetting, request: typeof fetch, channelId: string | number = message.channel.id) {
    if (providers[message.provider.toLowerCase()] == null) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.toLowerCase()](this, request, channelId, message.channel.coreId, message.channel.serviceId);
}
