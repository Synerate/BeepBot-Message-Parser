import { test } from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import { cloneDeep } from 'lodash';

import { pretzel } from '../../src/methods/pretzel';
import { mockMessage, mockSettings } from '../../src/mock';

const regexTest = /Now Playing: (.*) by (.*) -> (.*)/i;

test.beforeEach(t => {
    const message = cloneDeep(mockMessage);
    message.provider = 'mixer';
    t.context = { request: (<any> memoize)(fetch), message };
});

test('handle an invalid channel', async t => {
    t.is(await pretzel(t.context.message, mockSettings, t.context.request, 'all', 'uioh8y98797'), '[No Song Playing or Channel Not Found]');
});

test('parse song', async t => {
    t.context.message.channel.name = 'Chikachi';
    t.regex(await pretzel(t.context.message, mockSettings, t.context.request, 'song'), /([\w]*)\w+/i);
});

test('parse artist', async t => {
    t.context.message.channel.name = 'Chikachi';
    t.regex(await pretzel(t.context.message, mockSettings, t.context.request, 'artist'), /([\w]*)\w+/i);
});

test('parse link', async t => {
    t.context.message.channel.name = 'Chikachi';
    t.regex(await pretzel(t.context.message, mockSettings, t.context.request, 'link'), /([\w]*)\w+/i);
});

test('parse default', async t => {
    t.context.message.channel.name = 'Chikachi';
    t.regex(await pretzel(t.context.message, mockSettings, t.context.request), /(.*) by (.*)/i);
});
