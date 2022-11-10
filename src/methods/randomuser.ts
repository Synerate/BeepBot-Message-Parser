import * as config from 'config';
import { chain } from 'lodash';

import { Parser } from '../';
import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';

interface ITwitchChatters {
    [group: string]: string[];
}

interface ITrovoChatters {
    [role: string]: {
        viewers: string[];
    };
}

export async function randomuser(this: Parser, message: IMessage, _settings: ISetting, request: typeof fetch): Promise<string> {
    let res = null;
    let headers = {};

    let chatters: ITwitchChatters | ITrovoChatters = null;
    let users: string[] = [];

    switch (message.provider) {
        case 'twitch':
            res = await httpRequest(request, `https://tmi.twitch.tv/group/user/${message.channel.name}/chatters`);
            if (res == null) {
                return '[Error: API Error]';
            }
            chatters = res.chatters as ITwitchChatters;

            for (const group of Object.keys(chatters)) {
                if (chatters[group].length > 0) {
                    users.push(...chatters[group]);
                }
            }
            if (users.length === 0) {
                return '[No Users]';
            }

            return chain(users)
                .shuffle().shuffle().shuffle()
                .sample()
                .valueOf();
        case 'trovo':
            headers = {
                Accept: 'application/json',
                'Client-ID': config.get('providers.trovo.clientId'),
            };
            const body = { limit: 0, cursor: 0 };
            res = await httpRequest(request, `https://open-api.trovo.live/openplatform/channels/${message.channel.id}/viewers`, { headers, method: 'POST', body: JSON.stringify(body) });
            if (res == null) {
                return '[Error: API Error]';
            }
            chatters = res.chatters as ITrovoChatters;

            for (const group of Object.keys(chatters)) {
                if (chatters[group] == null || chatters[group].viewers == null || chatters[group].viewers.length < 1) {
                    continue;
                }
                users.push(...chatters[group].viewers);
            }
            // Remove dupes as Trovo list the user in all the groups they are in.
            users = [ ...new Set(users) ];

            return chain(users)
                .shuffle().shuffle().shuffle()
                .sample()
                .valueOf();
        case 'discord':
            return '<randomuser>';
        default:
            return '[Error: Invalid Provider]';
    }
}
