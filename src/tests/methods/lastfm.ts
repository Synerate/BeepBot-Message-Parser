import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { getTrack, ITrack, lastfm } from '../../methods/lastfm';
import { mockMessage, mockOpts, mockSettings } from '../../mock';

const tracks: ITrack[] = [
    {
        album: {
            '#text': 'Why Luca',
            mbid: undefined,
        },
        artist: {
            '#text': 'JamyDev',
            mbid: undefined,
        },
        mbid: undefined,
        name: 'The Dishwasher Life',
        streamable: '1',
        url: undefined,
    },
    {
        album: {
            '#text': 'Greatest Hits',
            mbid: undefined,
        },
        artist: {
            '#text': 'JamyDev',
            mbid: undefined,
        },
        mbid: undefined,
        name: 'Dog & Me',
        streamable: '1',
        url: undefined,
    },
];

test.beforeEach((t: any) => {
    t.context = { request: (<any> memoize)(fetch) };
});

test('get tracks right', (t: any) => {
    t.is(getTrack(tracks, '0'), tracks[0]);
    t.is(getTrack(tracks, '1'), tracks[1]);

    t.is(getTrack(tracks, '99'), tracks[0]);
});

test('parse song', async (t: any) => {
    const parsed = await lastfm(mockMessage, mockSettings, t.context.request, mockOpts, 'TestUser', 'song');
    t.is(parsed, 'Deadman\'s Gun');
});

test('parse artist', async (t: any) => {
    const parsed = await lastfm(mockMessage, mockSettings, t.context.request, mockOpts, 'TestUser', 'artist');
    t.is(parsed, 'Ashtar Command');
});

test('parse link', async (t: any) => {
    const parsed = await lastfm(mockMessage, mockSettings, t.context.request, mockOpts, 'TestUser', 'link');
    t.is(parsed, 'https://www.last.fm/music/Ashtar+Command/_/Deadman%27s+Gun');
});

test('parse invalid user', async (t: any) => {
    const parsed = await lastfm(mockMessage, mockSettings, t.context.request, mockOpts, 'aaddfwfsf');
    t.is(parsed, '[Invalid User]');
});

test('parse default', async (t: any) => {
    const parsed = await lastfm(mockMessage, mockSettings, t.context.request, mockOpts, 'TestUser');
    t.is(parsed, 'Deadman\'s Gun by Ashtar Command');
});

test('parse with when under set', async (t: any) => {
    const parsed = await lastfm(mockMessage, mockSettings, t.context.request, mockOpts, 'TestUser', 'default', '-1');
    t.is(parsed, 'Deadman\'s Gun by Ashtar Command');
});

test('parse with when over set', async (t: any) => {
    const parsed = await lastfm(mockMessage, mockSettings, t.context.request, mockOpts, 'TestUser', 'default', '15');
    t.is(parsed, 'Deadman\'s Gun by Ashtar Command');
});

test('parse with when over returned values', async (t: any) => {
    const parsed = await lastfm(mockMessage, mockSettings, t.context.request, mockOpts, 'TestUser', 'default', '15');
    t.is(parsed, 'Deadman\'s Gun by Ashtar Command');
});

test('parse with when invalid', async (t: any) => {
    const parsed = await lastfm(mockMessage, mockSettings, t.context.request, mockOpts, 'TestUser', 'default', 'invalid');
    t.is(parsed, 'Deadman\'s Gun by Ashtar Command');
});
