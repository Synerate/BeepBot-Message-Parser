import { test } from 'ava';

import { stream, streamer } from '../../src/methods/channel';
import { mockMessage } from '../../src/mock';

test('parse the streamer name', t => {
    const parsed = streamer(mockMessage);
    t.is(parsed, 'artdude543');
    t.not(parsed, 'TestUser');
});

test('parse the streamers link', t => {
    mockMessage.provider.type = 'beam';
    t.is(stream(mockMessage), 'https://beam.pro/artdude543');
    t.not(stream(mockMessage), 'https://twitch.tv/artdude543');

    mockMessage.provider.type = 'twitch';
    t.is(stream(mockMessage), 'https://twitch.tv/artdude543');
    t.not(stream(mockMessage), 'https://beam.pro/artdude543');

    mockMessage.provider.type = 'smashcast';
    t.is(stream(mockMessage), 'https://www.smashcast.tv/artdude543');
    t.not(stream(mockMessage), 'https://twitch.tv/artdude5433');
});

test('parse the streamers link with an invalid provider', t => {
    mockMessage.provider.type = 'youtube';
    const parsed = stream(mockMessage);
    t.is(parsed, '[Invalid Provider]');
});
