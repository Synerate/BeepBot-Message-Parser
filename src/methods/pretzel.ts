import * as config from 'config';

import { IMessage } from '../interface/message';
import { ISetting } from '../interface/settings';
import { httpRequest } from '../lib/helpers';

const nowPlaying = /Now Playing: (.*) by (.*) -> (.*)/i;

type SongType = 'song' | 'artist' | 'link' | string;

export async function pretzel(
    message: IMessage,
    settings: ISetting,
    request: typeof fetch,
    type: SongType = 'all',
    channel: string = message.channel.name,
    provider: string = message.provider.type) {
        const req: string = await httpRequest(request, `${config.get<string>('api.pretzel.base')}playing/${provider}/${channel}`);
        if (req == null) {
            return '[No Song Playing or Channel Not Found]';
        }

        const playing = nowPlaying.exec(req);
        switch (type) {
            case 'song':
                return playing[0];
            case 'artist':
                return playing[1];
            case 'link':
                return playing[3];
            default:
                return `${playing[0]} by ${playing[1]}`;
        }
    }
