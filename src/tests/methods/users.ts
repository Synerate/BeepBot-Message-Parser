import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { touser, user, userid } from '../../methods/users';
import { mockMessage, mockOpts, mockSettings } from '../../mock';

test.beforeEach((t: any) => {
    t.context = { request: (<any> memoize)(fetch) };
});

test('parse user', (t: any) => {
    t.is(user(mockMessage), 'TestUser');
});

test('parse touser', (t: any) => {
    const message = mockMessage;
    message.message.args = ['!command', 'BeepBot'];
    t.is(touser(message, mockSettings, t.context.request, mockOpts), 'BeepBot');
    t.not(touser(message, mockSettings, t.context.request, mockOpts), 'artdude543');

    // Use the default of the user running the command as the touser replacement.
    message.message.args = ['!command'];
    t.is(touser(message, mockSettings, t.context.request, mockOpts), 'TestUser');
    t.not(touser(message, mockSettings, t.context.request, mockOpts), 'artdude543');
});

test('parse touser with out default user', (t: any) => {
    const message = mockMessage;

    message.message.args = ['!command'];
    t.is(touser(message, mockSettings, t.context.request, mockOpts, true), '');
    t.is(touser(message, mockSettings, t.context.request, mockOpts, 'noDefault'), '');
    message.message.args = ['!command', 'BeepBot'];
    t.is(touser(message, mockSettings, t.context.request, mockOpts), 'BeepBot');
});

test('parser touser for discord', (t: any) => {
    const message = mockMessage;

    message.provider = 'discord';
    message.user.id = '489137472362512378';
    message.message.args = ['!command', 'BeepBot'];
    t.is(touser(message, mockSettings, t.context.request, mockOpts), '<@489137472362512378>');
    t.not(touser(message, mockSettings, t.context.request, mockOpts), 'artdude543');

    message.message.args = ['!command'];
    t.is(touser(message, mockSettings, t.context.request, mockOpts), '<@489137472362512378>');
    t.not(touser(message, mockSettings, t.context.request, mockOpts), 'artdude543');
});

test('parse touser with tagging', (t: any) => {
    const message = mockMessage;

    message.provider = 'mixer';
    message.message.args = ['!command', '@BeepBot'];
    t.is(touser(message, mockSettings, t.context.request, mockOpts), 'BeepBot');
    t.not(touser(message, mockSettings, t.context.request, mockOpts), '@BeepBot');
});

test('parse the userId', (t: any) => {
    mockMessage.user.id = 587;
    t.is(userid(mockMessage), 587);
    t.not(user(mockMessage), 'artdude543');
});
