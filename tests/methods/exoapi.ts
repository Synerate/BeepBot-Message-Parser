import { test } from 'ava';

import { exoapi, getChannel, getQuote } from '../../src/methods/exoapi';
import { mockMessage, mockSettings } from '../../src/mock';

const chanId = '2a437679-aeb5-4c86-a3a5-4d0b7689890f';

test('get channel data', async t => {
    t.is(await getChannel('InvalidTestUser'), '[API Error]');
    t.is(await getChannel('artdude543'), 'artdude543');
    t.is(await getChannel('artdude543', 'id'), chanId);
});

test('get channel quote', async t => {
    t.is(await getQuote('InvalidQuoteAPI'), '[API Error]');
    t.is(await getQuote(chanId, '1'), 'This is shit easy, artdude543');

    t.regex(await getQuote(chanId, '1'), /[^,]+/g);
    t.regex(await getQuote(chanId, 'invalid'), /[^,]+/g);
    t.regex(await getQuote(chanId, 'random'), /[^,]+/g);
});

test('parser handle requests', async t => {
    t.is(await exoapi(mockMessage, mockSettings, 'channel', chanId, 'id'), chanId);
    t.regex(await exoapi(mockMessage, mockSettings, 'quote', chanId), /[^,]+/g);
    t.is(await exoapi(mockMessage, mockSettings, 'invalid', chanId, 'id'), '[Invalid Method]');
});
