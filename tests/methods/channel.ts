import { test } from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import { cloneDeep } from 'lodash';

import { game, provider, stream, streamer, title } from '../../src/methods/channel';
import { mockMessage, mockSettings } from '../../src/mock';

test.beforeEach('create a new mockMessage', t => {
    t.context = { message: cloneDeep(mockMessage), request: (<any> memoize)(fetch) };
});

test('parse the streamer name', t => {
    const parsed = streamer(t.context.message);
    t.is(parsed, 'artdude543');
    t.not(parsed, 'TestUser');
});

test('parse the streamers link', t => {
    const message = t.context.message;
    message.provider.type = 'mixer';
    t.is(stream(message, mockSettings, t.context.request), 'https://mixer.com/artdude543');
    t.not(stream(message, mockSettings, t.context.request), 'https://twitch.tv/artdude543');

    message.provider.type = 'twitch';
    t.is(stream(message, mockSettings, t.context.request), 'https://twitch.tv/artdude543');
    t.not(stream(message, mockSettings, t.context.request), 'https://mixer.com/artdude543');

    message.provider.type = 'smashcast';
    t.is(stream(message, mockSettings, t.context.request), 'https://www.smashcast.tv/artdude543');
    t.not(stream(message, mockSettings, t.context.request), 'https://twitch.tv/artdude5433');

    message.provider.type = 'mixer';
    t.is(stream(message, mockSettings, t.context.request, 'tlovetech'), 'https://mixer.com/tlovetech');
    t.is(stream(message, mockSettings, t.context.request), 'https://mixer.com/artdude543');
    t.not(stream(message, mockSettings, t.context.request), 'https://twitch.tv/artdude543');
});

test('parse the streamers link with an invalid provider', t => {
    const message = t.context.message;
    message.provider.type = 'youtube';
    const parsed = stream(message, mockSettings, t.context.request);
    t.is(parsed, '[Invalid Provider]');
});

test('parse the title of the stream', async t => {
    const message = t.context.message;
    message.channel.id = 15757;
    message.provider.type = 'mixer';
    t.is(await title(message, mockSettings, t.context.request), 'TestUser\'s Channel');

    message.provider.type = 'invalid';
    t.is(await title(message, mockSettings, t.context.request), '[Invalid Provider]');
});

test('parse the game of the stream', async t => {
    const message = t.context.message;
    message.channel.id = 15757;
    message.provider.type = 'mixer';
    t.is(await game(message, mockSettings, t.context.request), 'Minecraft');

    message.provider.type = 'invalid';
    t.is(await game(message, mockSettings, t.context.request), '[Invalid Provider]');
});

test('parse the current provider', t => {
    const message = t.context.message;
    message.provider.type = 'mixer';
    t.is(provider(message), 'mixer');

    message.provider.type = 'twitch';
    t.is(provider(message), 'twitch');

    t.not(provider(message), 'beam');
});
