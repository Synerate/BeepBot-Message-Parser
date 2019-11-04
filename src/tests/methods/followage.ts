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
    const mixer = t.context.message;
    mixer.channel.id = 283247;
    mixer.user.id = 693;
    mixer.provider = 'mixer';

    t.is(await followage(mixer, undefined, t.context.request), '[User Not Following]');

    const twitch = t.context.message;
    twitch.channel.id = 40526358;
    twitch.user.id = 443665825;
    twitch.provider = 'twitch';
    t.is(await followage(twitch, undefined, t.context.request), '[User Not Following]');
});

test('handle a follower', async (t: any) => {
    const mixer = t.context.message;
    mixer.channel.id = 3181;
    mixer.user.id = 280486;
    mixer.provider = 'mixer';
    t.not(await followage(mixer, undefined, t.context.request), '[User Not Following]');

    const twitch = t.context.message;
    twitch.channel.id = 40526358;
    twitch.user.id = 36297622;
    twitch.provider = 'twitch';
    t.not(await followage(twitch, undefined, t.context.request), '[User Not Following]');
});

test('handle a bad-provider', async (t: any) => {
    const message = t.context.message;
    message.channel.id = 1;
    message.user.id = 280486;
    message.provider = 'cheese';

    t.is(await followage(message, undefined, t.context.request), '[API Error]');
});
