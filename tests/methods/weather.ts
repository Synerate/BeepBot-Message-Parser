import { test } from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { getDirection, weather } from '../../src/methods/weather';
import { mockMessage, mockSettings } from '../../src/mock';

const regex = /(\w+) is expecting ([\w ]+), with wind speeds of ([\d\.]+)mph./ig;

test.beforeEach(t => {
    t.context = { request: (<any> memoize)(fetch) };
});

test('get the direction of wind', t => {
    t.is(getDirection(120), 'ESE');
});

test('parse the weather', async t => {
    t.regex(await weather(mockMessage, mockSettings, t.context.request, 'London'), regex);
});

test('parse with an API error.', async t => {
    t.is(await weather(mockMessage, mockSettings, t.context.request, 'Iamqopidjhwoiu0938092ru2df'), '[API Error]');
});
