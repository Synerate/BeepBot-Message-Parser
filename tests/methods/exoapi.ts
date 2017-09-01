import { test } from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { exoapi, getChannel, getQuote } from '../../src/methods/exoapi';
import { mockMessage, mockSettings } from '../../src/mock';

const chanId = '2a437679-aeb5-4c86-a3a5-4d0b7689890f';

test.beforeEach(t => {
    t.context = { request: (<any> memoize)(fetch) };
});

test('get channel data', async t => {
    t.is(await getChannel(t.context.request, 'InvalidTestUser'), '[API Error]');
    t.is(await getChannel(t.context.request, 'artdude543'), 'artdude543');
    t.is(await getChannel(t.context.request, 'artdude543', 'id'), chanId);
});

test('get channel quote', async t => {
    t.is(await getQuote(t.context.request, 'InvalidQuoteAPI'), '[API Error]');
    t.is(await getQuote(t.context.request, chanId, '1'), 'This is shit easy, artdude543');

    t.regex(await getQuote(t.context.request, chanId, '1'), /[^,]+/g);
    t.regex(await getQuote(t.context.request, chanId, 'invalid'), /[^,]+/g);
    t.regex(await getQuote(t.context.request, chanId, 'random'), /[^,]+/g);
});

test('parser handle requests', async t => {
    t.is(await exoapi(mockMessage, mockSettings, t.context.request, 'channel', chanId, 'id'), chanId);
    t.regex(await exoapi(mockMessage, mockSettings, t.context.request, 'quote', chanId), /[^,]+/g);
    t.is(await exoapi(mockMessage, mockSettings, t.context.request, 'invalid', chanId, 'id'), '[Invalid Method]');
});
