import { test } from 'ava';

import { time } from '../../methods/time';
import { mockMessage, mockSettings } from '../../mock';

const testDate = 'Fri May 12 2017 13:43:20 GMT+0100 (GMT Summer Time)';

test('parse an invalid timezone.', t => {
    mockSettings.channel.locale = 'Invalid';
    t.is(time(mockMessage, mockSettings), '[Invalid Timezone]');
});

test('parse with format options', t => {
    mockSettings.channel.locale = 'Europe/London';
    t.notThrows(() => time(mockMessage, mockSettings, 'Europe/London', 'ha z'));
});

test('parse with out format options', t => {
    mockSettings.channel.locale = 'Europe/London';
    t.notThrows(() => time(mockMessage, mockSettings, 'Europe/London'));
});
