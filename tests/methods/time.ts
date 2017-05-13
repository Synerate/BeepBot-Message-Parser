import { test } from 'ava';

import { time } from '../../src/methods/time';
import { mockMessage, mockSettings } from '../../src/mock';

test('parse an invalid timezone.', t => {
    mockSettings.channel.timezone = 'Invalid';
    t.is(time(mockMessage, mockSettings), '[Invalid Timezone]');
});

test('parse with format options', t => {
    mockSettings.channel.timezone = 'Europe/London';
    t.notThrows(() => time(mockMessage, mockSettings, 'Europe/London', 'ha z'));
});

test('parse with out format options', t => {
    mockSettings.channel.timezone = 'Europe/London';
    t.notThrows(() => time(mockMessage, mockSettings, 'Europe/London'));
});
