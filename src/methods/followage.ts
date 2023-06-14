import * as config from 'config';
import * as countdown from 'countdown';
import { isString } from 'lodash';
import * as moment from 'moment';

import { Parser } from '../';
import { IMessage } from '../interface';
import { httpRequest } from '../lib/helpers';
import { IGlimeshRes } from './glimesh';

interface TrovoFollowers {
    total: string;
    follower: {
        user_id: string;
        nickname: string;
        profile_pic: string;
        followed_at: string;
    }[];
    total_page: number;
    cursor: number;
}

export const methods = {
    glimesh: async (_parser: Parser, request: typeof fetch, channelName: string, userName: string): Promise<string> => {
        const reqHeaders = {
            Authorization: `Client-ID ${config.get('providers.glimesh.clientId')}`,
        };
        const reqBody = `
            query {
                followers(streamerUsername: "${channelName}", userUsername: "${userName}") {
                    id
                    insertedAt
                }
            }
        `;

        const req = await httpRequest<IGlimeshRes>(request, config.get('providers.glimesh.api'), { headers: reqHeaders, method: 'POST', body: reqBody });
        if (req == null || isString(req)) {
            return '[Error: API Error]';
        }
        if (req?.data?.followers === null) {
            return '[User Not Following]';
        }

        return countdown(new Date(), moment(req.data.followers[0].insertedAt).toDate()).toString();
    },
    twitch: async (parser: Parser, _request: never, channelId: string, userId: string, coreId: string, serviceId: string): Promise<string> => {
        const res = await parser.middleware.onServiceAPI(
            `${config.get<string>('providers.twitch.api')}helix/users/follows?from_id=${userId}&to_id=${channelId}`, {
                coreId,
                method: 'GET',
                serviceId,
            });
        if (res == null) {
            return '[Error: API Error]';
        }

        if (res.total === 0 || res.data.length === 0) {
            return '[User Not Following]';
        }

        return countdown(new Date(), moment(res.data[0].followed_at).toDate()).toString();
    },
    kick: async (_parser: Parser, request: typeof fetch, channelId: string, userName: string, _coreId: string, _serviceId: string): Promise<string> => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        const res: any = await httpRequest(request, `${config.get<string>('providers.kickProxy.api')}v1/channels/${String(channelId).toLowerCase()}/users/${String(userName).toLowerCase()}`, { headers });
        if (res == null) {
            return '[Error: API Error]';
        }

        if (res.following_since == null) {
            return '[User Not Following]';
        }

        return countdown(new Date(), moment(res.following_since).toDate()).toString();
    },
    trovo: async (_parser: Parser, request: typeof fetch, channelId: string, userId: string) => {
        let foundFollower: boolean = false;
        const headers = {
            'Client-ID': config.get<string>('providers.trovo.clientId'),
        };
        const payload = {
            limit: 100,
            cursor: 0,
        };

        while (!foundFollower) {
            const res = await httpRequest<TrovoFollowers>(request, `${config.get<string>('providers.trovo.api')}/openplatform/channels/${channelId}/followers`, { headers, method: 'POST', body: JSON.stringify(payload) });
            if (res == null || isString(res)) {
                break;
            }

            for (const follower of res.follower) {
                if (follower.user_id === userId) {
                    foundFollower = true;

                    // This will have some timezone issues, as the API does not return a timezone. (We assume UTC)
                    return countdown(new Date(), moment(follower.followed_at).utc().toDate()).toString();
                }
            }

            // Set the updated cursor; wait 1 second to prevent rate limiting.
            payload.cursor = res.cursor;
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return '[User Not Following]';
    },
};

export async function followage(this: Parser, message: IMessage, _settings: never, request: typeof fetch) {
    if (methods[message.provider.toLowerCase()] == null) {
        return '[Error: Invalid Provider]';
    }

    if ([ 'glimesh', 'kick' ].includes(message.provider.toLowerCase())) {
        return methods[message.provider.toLowerCase()](this, request, message.channel.name, message.user.name, message.channel.coreId, message.channel.serviceId);
    }

    return methods[message.provider.toLowerCase()](this, request, message.channel.id, message.user.id, message.channel.coreId, message.channel.serviceId);
}
