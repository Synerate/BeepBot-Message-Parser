import { test } from 'ava';

import { query, randomnum } from '../../src/methods/string';
import { mockMessage, mockSettings } from '../../src/mock';

test('parse query', t => {
    t.is(query(mockMessage), 'the parser!');
    t.not(query(mockMessage), 'Another random message');
});

test('parse randomnum', t => {
    t.is(randomnum(mockMessage, mockSettings, null, 'No', 'Bad'), '[Min or Max needs to be a number]');
    t.is(randomnum(mockMessage, mockSettings, null, '0', '0'), '[Min or Max needs to be more than 0]');
    t.is(randomnum(mockMessage, mockSettings, null, '10', '5'), '[Min should not be more than the Max]');
    t.is(randomnum(mockMessage, mockSettings, null, '1', '1'), '1');
});
