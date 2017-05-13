import { test } from 'ava';

import { getTrack, ITrack, lastfm } from '../../src/methods/lastfm';
import { mockMessage, mockSettings } from '../../src/mock';

const tracks: ITrack[] = [
    {
        album: {
            '#text': 'Why Luca',
            mbid: null,
        },
        artist: {
            '#text': 'JamyDev',
            mbid: null,
        },
        mbid: null,
        name: 'The Dishwasher Life',
        streamable: '1',
        url: null,
    },
    {
        album: {
            '#text': 'Greatest Hits',
            mbid: null,
        },
        artist: {
            '#text': 'JamyDev',
            mbid: null,
        },
        mbid: null,
        name: 'Dog & Me',
        streamable: '1',
        url: null,
    },
];

test('get tracks right', t => {
    t.is(getTrack(tracks, '0'), tracks[0]);
    t.is(getTrack(tracks, '1'), tracks[1]);

    t.is(getTrack(tracks, '99'), tracks[0]);
});

test('parse song', async t => {
    const parsed = await lastfm(mockMessage, mockSettings, 'TestUser', 'song');
    t.is(parsed, 'Deadman\'s Gun');
});

test('parse artist', async t => {
    const parsed = await lastfm(mockMessage, mockSettings, 'TestUser', 'artist');
    t.is(parsed, 'Ashtar Command');
});

test('parse link', async t => {
    const parsed = await lastfm(mockMessage, mockSettings, 'TestUser', 'link');
    t.is(parsed, 'https://www.last.fm/music/Ashtar+Command/_/Deadman%27s+Gun');
});

test('parse invalid user', async t => {
    const parsed = await lastfm(mockMessage, mockSettings, 'aaddfwfsf');
    t.is(parsed, '[Invalid User]');
});

test('parse default', async t => {
    const parsed = await lastfm(mockMessage, mockSettings, 'TestUser');
    t.is(parsed, 'Deadman\'s Gun by Ashtar Command');
});

test('parse with when under set', async t => {
    const parsed = await lastfm(mockMessage, mockSettings, 'TestUser', 'default', '-1');
    t.is(parsed, 'Deadman\'s Gun by Ashtar Command');
});

test('parse with when over set', async t => {
    const parsed = await lastfm(mockMessage, mockSettings, 'TestUser', 'default', '15');
    t.is(parsed, 'Deadman\'s Gun by Ashtar Command');
});

test('parse with when over returned values', async t => {
    const parsed = await lastfm(mockMessage, mockSettings, 'TestUser', 'default', '15');
    t.is(parsed, 'Deadman\'s Gun by Ashtar Command');
});

test('parse with when invalid', async t => {
    const parsed = await lastfm(mockMessage, mockSettings, 'TestUser', 'default', 'invalid');
    t.is(parsed, 'Deadman\'s Gun by Ashtar Command');
});
