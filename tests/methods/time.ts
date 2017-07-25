import { test } from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { time } from '../../src/methods/time';
import { mockMessage, mockSettings } from '../../src/mock';

test.beforeEach(t => {
    t.context = { request: (<any> memoize)(fetch) };
});

test('parse an invalid timezone.', t => {
    mockSettings.channel.timezone = 'Invalid';
    t.is(time(mockMessage, mockSettings, t.context.request), '[Invalid Timezone]');
});

test('parse with format options', t => {
    mockSettings.channel.timezone = 'Europe/London';
    t.notThrows(() => time(mockMessage, mockSettings, t.context.request, 'Europe/London', 'ha z'));
});

test('parse with out format options', t => {
    mockSettings.channel.timezone = 'Europe/London';
    t.notThrows(() => time(mockMessage, mockSettings, t.context.request, 'Europe/London'));
});
