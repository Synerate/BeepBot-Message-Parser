import { test } from 'ava';

import { getDirection, weather } from '../../methods/weather';
import { mockMessage, mockSettings } from '../../mock';

const regex = /(\w+) is expecting ([\w ]+), with wind speeds of ([\d\.]+)mph./ig;

test('get the direction of wind', t => {
    t.is(getDirection(120), 'ESE');
});

test('parse the weather', async t => {
    t.regex(await weather(mockMessage, mockSettings, 'London'), regex);
});

test('parse with an API error.', async t => {
    t.is(await weather(mockMessage, mockSettings, 'Iamqopidjhwoiu0938092ru2df'), '[API Error]');
});
