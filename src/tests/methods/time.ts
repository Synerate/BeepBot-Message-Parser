import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { time } from '../../methods/time';
import { mockMessage, mockSettings } from '../../mock';

test.beforeEach((t: any) => {
    t.context = { request: (<any> memoize)(fetch) };
});

test('parse an invalid timezone.', (t: any) => {
    mockSettings.timezone = 'Invalid';
    t.is(time(mockMessage, mockSettings, t.context.request), '[Invalid Timezone]');
});

test('parse with format options', (t: any) => {
    mockSettings.timezone = 'Europe/London';
    t.notThrows(() => time(mockMessage, mockSettings, t.context.request, 'Europe/London', 'ha z'));
});

test('parse with out format options', (t: any) => {
    mockSettings.timezone = 'Europe/London';
    t.notThrows(() => time(mockMessage, mockSettings, t.context.request, 'Europe/London'));
});
