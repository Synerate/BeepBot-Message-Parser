import * as config from 'config';
import { stringify } from 'querystring';

import { IMessage } from '../interface/message';
import { ISetting } from '../interface/settings';
import { httpRequest } from '../lib/helpers';

export interface IRecentTracks {
    error: number;
    recenttracks: {
        track: ITrack[];
        '@attr': {
            user: string;
            page: string;
            perPage: string;
            totalPages: string;
            total: string;
        };
    };
}

export interface ITrack {
    artist: {
        '#text': string;
        mbid: string;
    };
    name: string;
    mbid: string;
    streamable: string;
    album: {
        '#text': string;
        mbid: string;
    };
    url: string;
}

type SongType = 'song' | 'artist' | 'link' | string;

/**
 * Check that the track requested is valid on the response then returns it.
 *
 * Also checks if the "when" param is valid.
 */
export function getTrack(tracks: ITrack[], when: string): ITrack {
    if (isNaN(Number(when)) || Number(when) < 0 || Number(when) > 10 || tracks[Number(when)] == null) {
        return tracks[0];
    }

    return tracks[when];
}

/**
 * Returns the LastFM data about a user based on the given type.
 *
 * Default: Returns the song name and artist.
 */
// tslint:disable-next-line:max-line-length
export async function lastfm(message: IMessage, settings: ISetting, request: typeof fetch, user: string, type: SongType = null, when: string = '0') {
    const opts = {
        api_key: config.get<string>('api.lastfm.key'),
        format: 'json',
        limit: 10,
        method: 'user.getrecenttracks',
        user,
    };
    // tslint:disable-next-line:max-line-length
    const { recenttracks, error }: IRecentTracks = await httpRequest(request, `${config.get<string>('api.lastfm.base')}?${stringify(opts)}`);
    if (error != null) {
        return '[Invalid User]';
    }

    const { name, artist, url } = getTrack(recenttracks.track, when);
    switch (type) {
        case 'song':
            return name;
        case 'artist':
            return artist['#text'];
        case 'link':
            return url;
        default:
            return `${name} by ${artist['#text']}`;
    }
}
