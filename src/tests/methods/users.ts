import test from 'ava';

import { touser, user, userid } from '../../methods/users';
import { mockMessage } from '../../mock';

test('parse user', (t: any) => {
    t.is(user(mockMessage), 'TestUser');
});

test('parse touser', (t: any) => {
    const message = mockMessage;
    message.message.args = ['!command', 'BeepBot'];
    t.is(touser(message), 'BeepBot');
    t.not(touser(message), 'artdude543');

    // Use the default of the user running the command as the touser replacement.
    message.message.args = ['!command'];
    t.is(touser(message), 'TestUser');
    t.not(touser(message), 'artdude543');
});

test('parser touser for discord', (t: any) => {
    const message = mockMessage;

    message.provider = 'discord';
    message.user.id = '489137472362512378';
    t.is(touser(message), '<@489137472362512378>');
    t.not(touser(message), 'artdude543');
});

test('parse touser with tagging', (t: any) => {
    const message = mockMessage;

    message.message.args = ['!command', '@BeepBot'];
    t.is(touser(message), 'BeepBot');
    t.not(touser(message), '@BeepBot');
});

test('parse the userId', (t: any) => {
    mockMessage.user.id = 587;
    t.is(userid(mockMessage), 587);
    t.not(user(mockMessage), 'artdude543');
});
