import * as config from 'config';

import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';
import { SongType } from './lastfm';

const nowPlaying = /Now Playing: (.*) by (.*) -> (.*)/i;

export async function pretzel(message: IMessage, _settings: ISetting, request: typeof fetch, type: SongType = 'all', channelId: string | number = message.channel.id, provider: string = message.provider) {
    const req: string = await httpRequest(request, `${config.get<string>('api.pretzel.base')}playing/${provider}/${channelId}`);
    if (req === undefined) {
        return '[No Song Playing or Channel Not Found]';
    }

    const playing = nowPlaying.exec(req);
    if (playing == null) {
        return '[API Error]';
    }

    switch (type) {
        case 'song':
            return playing[1];
        case 'artist':
            return playing[2];
        case 'link':
            return playing[3];
        default:
            return `${playing[1]} by ${playing[2]}`;
    }
}
