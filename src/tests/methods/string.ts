import test from 'ava';

import { arg, incr, query, randomnum } from '../../methods/string';
import { mockMessage, mockSettings } from '../../mock';

test('parse query', (t: any) => {
    t.is(query(mockMessage), 'the parser!');
    t.not(query(mockMessage), 'Another random message');
});

test('parse randomnum', (t: any) => {
    t.is(randomnum(mockMessage, mockSettings, undefined, 'No', 'Bad'), '[Min or Max needs to be a number]');
    t.is(randomnum(mockMessage, mockSettings, undefined, '0', '0'), '[Min or Max needs to be more than 0]');
    t.is(randomnum(mockMessage, mockSettings, undefined, '10', '5'), '[Min should not be more than the Max]');
    t.is(randomnum(mockMessage, mockSettings, undefined, '1', '1'), '1');
});

test('parse an incr', (t: any) => {
    t.is(incr(mockMessage, mockSettings, undefined, '10', '100'), '110');
    t.is(incr(mockMessage, mockSettings, undefined, 'test', '100'), '[Base or Val needs to be a number]');
    t.is(incr(mockMessage, mockSettings, undefined, '10', 'test'), '[Base or Val needs to be a number]');
});

test('parse an arg', (t: any) => {
    t.is(arg(mockMessage, mockSettings, undefined, '1'), 'the');
    t.not(arg(mockMessage, mockSettings, undefined, '0'), 'parser!');
});
