import { test } from 'ava';

import { beam } from '../../src/methods/beam';
import { mockMessage, mockSettings } from '../../src/mock';

const message = mockMessage;

message.channel.id = 587;
message.user.id = 693;

test('handles an invalid type', async t => {
    const parse = await beam(message, mockSettings, 'invalid');
    t.is(parse, '[Invalid Type]');
});

test('handles a correct type', async t => {
    const parse = await beam(message, mockSettings, 'token');
    t.is(parse, 'artdude543');
});
