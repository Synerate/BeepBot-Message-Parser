import * as _ from 'lodash';

import { Parser } from '..';
import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';

interface ITwitchChatters {
    [group: string]: string[];
}

export async function randomuser(this: Parser, message: IMessage, _settings: ISetting, request: typeof fetch): Promise<string> {
    const users: string[] = [];

    switch (message.provider) {
        case 'twitch':
            const res = await httpRequest(request, `https://tmi.twitch.tv/group/user/${message.channel.name}/chatters`);
            if (res == null) {
                return '[API Error]';
            }

            const chatters: ITwitchChatters = res.chatters;

            for (const group of Object.keys(chatters)) {
                if (group === 'broadcaster') {
                    continue;
                }

                if (chatters[group].length > 0) {
                    users.push(...chatters[group]);
                }
            }
            if (users.length === 0) {
                return '[No Users]';
            }

            return _(users).shuffle().shuffle().shuffle().sample();
        case 'discord':
            return '<randomuser>';
        default:
            return '[Not Supported]';
    }
}
