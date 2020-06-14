import test from 'ava';

import { arg, incr, query, randomnum } from '../../methods/string';
import { mockMessage, mockOpts, mockSettings } from '../../mock';

test('parse query', (t: any) => {
    t.is(query(mockMessage), 'the parser!');
    t.not(query(mockMessage), 'Another random message');
});

test('parse randomnum', (t: any) => {
    t.is(randomnum(mockMessage, mockSettings, undefined, mockOpts, 'No', 'Bad'), '[Min or Max needs to be a number]');
    t.is(randomnum(mockMessage, mockSettings, undefined, mockOpts, '0', '0'), '[Min or Max needs to be more than 0]');
    t.is(randomnum(mockMessage, mockSettings, undefined, mockOpts, '10', '5'), '[Min should not be more than the Max]');
    t.is(randomnum(mockMessage, mockSettings, undefined, mockOpts, '1', '1'), '1');
});

test('parse an incr', (t: any) => {
    t.is(incr(mockMessage, mockSettings, undefined, mockOpts, '10', '100'), '110');
    t.is(incr(mockMessage, mockSettings, undefined, mockOpts, 'test', '100'), '[Base or Val needs to be a number]');
    t.is(incr(mockMessage, mockSettings, undefined, mockOpts, '10', 'test'), '[Base or Val needs to be a number]');
});

test('parse an arg', (t: any) => {
    t.is(arg(mockMessage, mockSettings, undefined, mockOpts, '1'), 'the');
    t.is(arg(mockMessage, mockSettings, undefined, mockOpts, 'c'), '[Index is not a number]');
    t.is(arg(mockMessage, mockSettings, undefined, mockOpts, '100'), '');
    t.not(arg(mockMessage, mockSettings, undefined, mockOpts, '0'), 'parser!');
});
