import * as config from 'config';
import * as countdown from 'countdown';
import { isString } from 'lodash';
import * as moment from 'moment';

import { Parser, ParserContext } from '../';
import { IMessage } from '../interface';
import { httpRequest } from '../lib/helpers';

interface FollowResponse {
    error?: string;
    following: boolean;
    following_since: string;
}

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
    twitch: async (parser: Parser, _request: never, channelId: string, userId: string, coreId: string, serviceId: string): Promise<FollowResponse> => {
        const res = await parser.middleware.onServiceAPI(
            `${config.get<string>('providers.twitch.api')}helix/channels/followers?user_id=${userId}&broadcaster_id=${channelId}`, {
                coreId,
                method: 'GET',
                serviceId,
            });
        if (res == null) {
            return {
                error: '[Error: API Error]',
                following: false,
                following_since: null,
            };
        }

        if (res.total === 0 || res.data.length === 0) {
            return {
                following: false,
                following_since: null,
            };
        }

        return {
            following: true,
            following_since: countdown(new Date(), moment(res.data[0].followed_at).toDate()).toString(),
        };
    },
    kick: async (_parser: Parser, request: typeof fetch, channelId: string, userName: string, _coreId: string, _serviceId: string): Promise<FollowResponse> => {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        const res: any = await httpRequest(request, `${config.get<string>('providers.kickProxy.api')}v1/channels/${String(channelId).toLowerCase()}/users/${String(userName).toLowerCase()}`, { headers });
        if (res == null) {
            return {
                error: '[Error: API Error]',
                following: false,
                following_since: null,
            };
        }

        if (res.following_since == null) {
            return {
                following: false,
                following_since: null,
            };
        }

        return {
            following: true,
            following_since: countdown(new Date(), moment(res.following_since).toDate()).toString(),
        };
    },
    trovo: async (_parser: Parser, request: typeof fetch, channelId: string, userId: string): Promise<FollowResponse> => {
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
                    return {
                        following: true,
                        following_since: countdown(new Date(), moment(follower.followed_at).utc().toDate()).toString(),
                    };
                }
            }

            // Set the updated cursor; wait 1 second to prevent rate limiting.
            payload.cursor = res.cursor;
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return {
            following: false,
            following_since: null,
        };
    },
};

export async function followage(this: Parser, message: IMessage, _settings: never, { request }: ParserContext) {
    if (methods[message.provider.toLowerCase()] == null) {
        return '[Error: Invalid Provider]';
    }

    try {
        let userFollowing: FollowResponse = null;

        if ([ 'kick' ].includes(message.provider.toLowerCase())) {
            userFollowing = await methods[message.provider.toLowerCase()](this, request, message.channel.name, message.user.name, message.channel.coreId, message.channel.serviceId);
        } else {
            userFollowing = await methods[message.provider.toLowerCase()](this, request, message.channel.id, message.user.id, message.channel.coreId, message.channel.serviceId);
        }

        if (userFollowing.error != null) {
            return userFollowing.error;
        }

        if (!userFollowing.following) {
            return `@${message.user.name}, you are not following the channel.`;
        }

        return `@${message.user.name}, you have been following for ${userFollowing.following_since}.`;
    } catch (err) {
        return '[Error: API Error]';
    }
}
