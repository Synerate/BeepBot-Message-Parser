import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { touser, user, userid } from '../../methods/users';
import { mockMessage, mockSettings } from '../../mock';

test.beforeEach((t: any) => {
    t.context = { request: (<any> memoize)(fetch) };
});

test('parse user', (t: any) => {
    t.is(user(mockMessage), 'TestUser');
});

test('parse touser', (t: any) => {
    const message = mockMessage;
    message.message.args = ['!command', 'BeepBot'];
    t.is(touser(message, mockSettings, t.context.request), 'BeepBot');
    t.not(touser(message, mockSettings, t.context.request), 'artdude543');

    // Use the default of the user running the command as the touser replacement.
    message.message.args = ['!command'];
    t.is(touser(message, mockSettings, t.context.request), 'TestUser');
    t.not(touser(message, mockSettings, t.context.request), 'artdude543');
});

test('parse touser with out default user', (t: any) => {
    const message = mockMessage;

    message.message.args = ['!command'];
    t.is(touser(message, mockSettings, t.context.request, true), '');
    t.is(touser(message, mockSettings, t.context.request, 'noDefault'), '');
    message.message.args = ['!command', 'BeepBot'];
    t.is(touser(message, mockSettings, t.context.request), 'BeepBot');
});

test('parser touser for discord', (t: any) => {
    const message = mockMessage;

    message.provider = 'discord';
    message.user.id = '489137472362512378';
    t.is(touser(message, mockSettings, t.context.request), '<@489137472362512378>');
    t.not(touser(message, mockSettings, t.context.request), 'artdude543');
});

test('parse touser with tagging', (t: any) => {
    const message = mockMessage;

    message.provider = 'mixer';
    message.message.args = ['!command', '@BeepBot'];
    t.is(touser(message, mockSettings, t.context.request), 'BeepBot');
    t.not(touser(message, mockSettings, t.context.request), '@BeepBot');
});

test('parse the userId', (t: any) => {
    mockMessage.user.id = 587;
    t.is(userid(mockMessage), 587);
    t.not(user(mockMessage), 'artdude543');
});
