import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import { cloneDeep } from 'lodash';

import { followage } from '../../methods/followage';
import { mockMessage } from '../../mock';

test.beforeEach('create a new mockMessage', (t: any) => {
    t.context = { message: cloneDeep(mockMessage), request: (<any> memoize)(fetch) };
});

test('handle a non-follower', async (t: any) => {
    const message = t.context.message;
    message.channel.id = 283247;
    message.user.id = 693;
    message.provider = 'mixer';

    t.is(await followage(message, undefined, t.context.request), 'User does not follow the channel.');
});

test('handle a follower', async (t: any) => {
    const message = t.context.message;
    message.channel.id = 3181;
    message.user.id = 280486;
    message.provider = 'mixer';

    t.not(await followage(message, undefined, t.context.request), 'User does not follow the channel.');
});

test('handle a bad-provider', async (t: any) => {
    const message = t.context.message;
    message.channel.id = 1;
    message.user.id = 280486;
    message.provider = 'cheese';

    t.is(await followage(message, undefined, t.context.request), '[API Error]');
});
