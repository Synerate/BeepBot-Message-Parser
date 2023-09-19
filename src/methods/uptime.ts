import * as config from 'config';
import * as countdown from 'countdown';
import * as moment from 'moment';

import { Parser, ParserContext } from '../';
import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';

const providers = {
    trovo: async (_parser: Parser, request: typeof fetch, channelId: string | number, _coreId: string, _serviceId: string): Promise<any> => {
        const reqHeaders = {
            Accept: 'application/json',
            'Client-ID': config.get<string>('providers.trovo.clientId'),
        };

        const reqBody = {};
        if (isNaN(Number(channelId))) {
            reqBody['username'] = channelId;
        } else {
            reqBody['channel_id'] = channelId;
        }

        const res: any = await httpRequest(request, `${config.get('providers.trovo.urls.api')}/openplatform/channels/id`, { headers: reqHeaders, method: 'POST', body: JSON.stringify(reqBody) });
        if (res == null || res['is_live'] === false || Number(res['started_at']) < 1) {
            return '[Channel Offline]';
        }

        return countdown(new Date(), moment(new Date(Number(res['started_at']) * 1000)).toDate());
    },
    twitch: async (parser: Parser, _request: typeof fetch, channelId: string | number, coreId: string, serviceId: string): Promise<any> => {
        const res = await parser.middleware.onServiceAPI(`${config.get<string>('providers.twitch.urls.api')}/helix/streams?user_id=${channelId}`, {
            coreId,
            method: 'GET',
            serviceId,
        });
        if (res == null || res.data.length === 0) {
            return '[Channel Offline]';
        }

        return countdown(new Date(), moment(res.data[0].started_at).toDate());
    },
    picarto: async (_parser: Parser, request: typeof fetch, channelId: string | number, coreId: string, serviceId: string): Promise<any> => {
        let uri: string | null = null;
        if (isNaN(Number(channelId))) {
            uri = `${config.get<string>('providers.picarto.urls.api')}/api/v1/channel/name/${channelId}`;
        } else {
            uri = `${config.get<string>('providers.picarto.urls.api')}/api/v1/channel/id/${channelId}`;
        }

        const res: any = await httpRequest(request, uri);
        if (res == null || res['online'] === false || res['last_live'] == null) {
            return '[Channel Offline]';
        }

        return countdown(new Date(), moment(new Date(res['last_live'])).toDate());
    },
    kick: async (_parser: Parser, request: typeof fetch, channelId: string | number, coreId: string, serviceId: string): Promise<any> => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        const res: any = await httpRequest(request, `${config.get<string>('providers.kick.urls.api')}/v1/channels/${String(channelId).toUpperCase()}`, { headers });
        if (res == null || res.livestream == null) {
            return '[Channel Offline]';
        }

        return countdown(new Date(), moment(res.livestream.created_at).toDate());
    },
};

/**
 * Get the current uptime for a channel given on a provider.
 *
 * @Optional: Accepts a channel Id to check. Needs to match the ID for the provider which the command is ran from.
 */
export function uptime(this: Parser, message: IMessage, _settings: ISetting, { request }: ParserContext, channelId: string | number = message.channel.id) {
    if (providers[message.provider.toLowerCase()] == null) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.toLowerCase()](this, request, channelId, message.channel.coreId, message.channel.serviceId);
}
