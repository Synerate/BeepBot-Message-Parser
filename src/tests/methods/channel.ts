import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import { cloneDeep } from 'lodash';

import { game, provider, stream, streamer, title } from '../../methods/channel';
import { mockMessage, mockSettings } from '../../mock';

test.beforeEach('create a new mockMessage', (t: any) => {
    t.context = { message: cloneDeep(mockMessage), request: (<any> memoize)(fetch) };
});

test('parse the streamer name', (t: any) => {
    const parsed = streamer(t.context.message);
    t.is(parsed, 'artdude543');
    t.not(parsed, 'TestUser');
});

test('parse the streamers link', (t: any) => {
    const message = t.context.message;
    message.provider = 'mixer';
    t.is(stream(message, mockSettings, t.context.request), 'https://mixer.com/artdude543');
    t.not(stream(message, mockSettings, t.context.request), 'https://twitch.tv/artdude543');

    message.provider = 'twitch';
    t.is(stream(message, mockSettings, t.context.request), 'https://twitch.tv/artdude543');
    t.not(stream(message, mockSettings, t.context.request), 'https://mixer.com/artdude543');

    message.provider = 'smashcast';
    t.is(stream(message, mockSettings, t.context.request), 'https://www.smashcast.tv/artdude543');
    t.not(stream(message, mockSettings, t.context.request), 'https://twitch.tv/artdude5433');

    message.provider = 'mixer';
    t.is(stream(message, mockSettings, t.context.request, 'tlovetech'), 'https://mixer.com/tlovetech');
    t.is(stream(message, mockSettings, t.context.request), 'https://mixer.com/artdude543');
    t.not(stream(message, mockSettings, t.context.request), 'https://twitch.tv/artdude543');

    // Check the tags are removed from the message.
    t.is(stream(message, mockSettings, t.context.request, '@artdude543'), 'https://mixer.com/artdude543');
    t.is(stream(message, mockSettings, t.context.request, '#artdude543'), 'https://mixer.com/artdude543');
});

test('parse the streamers link with an invalid provider', (t: any) => {
    const message = t.context.message;
    message.provider = 'youtube';
    const parsed = stream(message, mockSettings, t.context.request);
    t.is(parsed, '[Invalid Provider]');
});

test('parse the title of the stream', async (t: any) => {
    const message = t.context.message;
    message.channel.id = 15757;
    message.provider = 'mixer';
    t.is(await title(message, mockSettings, t.context.request), 'TestUser\'s Channel');

    message.provider = 'invalid';
    t.is(await title(message, mockSettings, t.context.request), '[Invalid Provider]');
});

test('parse the game of the stream', async (t: any) => {
    const message = t.context.message;
    message.channel.id = 15757;
    message.provider = 'mixer';
    t.is(await game(message, mockSettings, t.context.request), 'Minecraft');

    message.provider = 'invalid';
    t.is(await game(message, mockSettings, t.context.request), '[Invalid Provider]');
});

test('parse the current provider', (t: any) => {
    const message = t.context.message;
    message.provider = 'mixer';
    t.is(provider(message), 'mixer');

    message.provider = 'twitch';
    t.is(provider(message), 'twitch');

    t.not(provider(message), 'beam');
});
