import { test } from 'ava';

import { getDirection, weather } from '../../methods/weather';
import { mockMessage, mockSettings } from '../../mock';

let okResponse = '';

test('get the direction of wind', t => {
    t.is(getDirection(120), 'ESE');
});

test.before('get result', async t => {
    okResponse = await weather(mockMessage, mockSettings, 'London');
});

test('parse the weather', async t => {
    t.is(await weather(mockMessage, mockSettings, 'London'), okResponse);
});

test('parse with an API error.', async t => {
    t.is(await weather(mockMessage, mockSettings, 'Iamqopidjhwoiu0938092ru2df'), '[API Error]');
});
