import { isString } from 'lodash';
import { stringify } from 'querystring';

import { Parser, ParserContext } from '../';
import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';

const RadioMap = {
    game: 1,
    ocremix: 2,
    covers: 3,
    chiptunes: 4,
    all: 5
};

export async function rainwave(this: Parser, _message: IMessage, _settings: ISetting, { request }: ParserContext, radio: string, ...formatted: string[]) {
    let radioId = RadioMap[radio?.toLowerCase()];
    if (radioId == null) {
        radioId = RadioMap.all;
    }

    const reqOpts = {
        sid: radioId,
    };
    const req = await httpRequest<IRadioInfo>(request, `https://rainwave.cc/api4/info?${stringify(reqOpts)}`);
    if (req == null || isString(req)) {
        return `[Error: Unable to fetch radio info]`;
    }

    const current = req.sched_current?.songs?.[0];
    if (current == null) {
        return `[Error: No song found]`;
    }

    const artists = current.artists?.map(artist => artist.name);
    const albums = current.albums?.map(album => album.name);
    const url = current.url || '';

    if (formatted != null && formatted.length > 0) {
        return formatted.join(' ')
            .replace(/#title/g, current.title)
            .replace(/#artist/g, artists?.join(', '))
            .replace(/#album/g, albums?.join(', '))
            .replace(/#url/g, url);
    }

    return `${current.title} by ${artists?.join(', ')} on ${albums?.join(', ')}${url === '' ? '' : ' - '}`;
}

interface IRadioInfo {
    user: never;
    album_diff: never;
    request_line: never[];
    sched_current: {
        songs: {
            title: string;
            url: string | null;
            artists: {
                name: string;
            }[];
            albums: {
                name: string;
            }[];
        }[];
    };
}
