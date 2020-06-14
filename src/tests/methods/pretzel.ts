import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import { cloneDeep } from 'lodash';

import { pretzel } from '../../methods/pretzel';
import { mockMessage, mockOpts, mockSettings } from '../../mock';

const regexTest = /Now Playing: (.*) by (.*) -> (.*)/i;

test.beforeEach((t: any) => {
    const message = cloneDeep(mockMessage);
    message.provider = 'mixer';
    t.context = { request: (<any> memoize)(fetch), message };
});

test('handle an invalid channel', async (t: any) => {
    t.is(await pretzel(t.context.message, mockSettings, t.context.request, mockOpts, 'all', 'uioh8y98797'), '[No Song Playing or Channel Not Found]');
});

test('parse song', async (t: any) => {
    t.context.message.channel.name = 'Chikachi';
    t.regex(await pretzel(t.context.message, mockSettings, t.context.request, mockOpts, 'song'), /([\w]*)\w+/i);
});

test('parse artist', async (t: any) => {
    t.context.message.channel.name = 'Chikachi';
    t.regex(await pretzel(t.context.message, mockSettings, t.context.request, mockOpts, 'artist'), /([\w]*)\w+/i);
});

test('parse link', async (t: any) => {
    t.context.message.channel.name = 'Chikachi';
    t.regex(await pretzel(t.context.message, mockSettings, t.context.request, mockOpts, 'link'), /([\w]*)\w+/i);
});

test('parse default', async (t: any) => {
    t.context.message.channel.name = 'Chikachi';
    t.regex(await pretzel(t.context.message, mockSettings, t.context.request, mockOpts), /(.*) by (.*)/i);
});
