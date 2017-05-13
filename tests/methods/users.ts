import { test } from 'ava';

import { touser, user } from '../../src/methods/users';
import { mockMessage } from '../../src/mock';

test('parse user', t => {
    t.is(user(mockMessage), 'TestUser');
});

test('parse touser', t => {
    const message = mockMessage;
    message.message.args = ['!command', 'BeepBot'];
    t.is(touser(message), 'BeepBot');
    t.not(touser(message), 'artdude543');

    // Use the default of the user running the command as the touser replacement.
    message.message.args = ['!command'];
    t.is(touser(message), 'TestUser');
    t.not(touser(message), 'artdude543');
});
