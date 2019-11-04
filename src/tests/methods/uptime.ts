import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import { cloneDeep } from 'lodash';

import { uptime } from '../../methods/uptime';
import { mockMessage } from '../../mock';

test.beforeEach('create a new mockMessage', (t: any) => {
    t.context = { message: cloneDeep(mockMessage), request: (<any> memoize)(fetch) };
});

test('handles a bad-provider', (t: any) => {
    const message = t.context.message;
    message.provider = 'cheese';

    t.is(uptime(message, undefined, t.context.request), '[Invalid Provider]');
});

test('handles twitch', async (t: any) => {
    const message = t.context.message;
    message.channel.id = '269478385';
    message.provider = 'twitch';

    message.channel.id = '38237567';
    t.is(await uptime(message, undefined, t.context.request), '[Channel Offline]');
});

test('handles mixer', async (t: any) => {
    const message = t.context.message;
    message.channel.id = 160788;
    message.provider = 'mixer';

    t.not(await uptime(message, undefined, t.context.request), '[Channel Offline]');

    message.channel.id = 2230;
    t.is(await uptime(message, undefined, t.context.request), '[Channel Offline]');
});

test('handles smashcast', async (t: any) => {
    const message = t.context.message;
    message.channel.id = '508632';
    message.provider = 'smashcast';
    t.not(await uptime(message, undefined, t.context.request), '[Channel Offline]');

    message.channel.id = 'undefinednull';
    t.is(await uptime(message, undefined, t.context.request), '[Channel Offline]');

    message.channel.id = '708419';
    t.is(await uptime(message, undefined, t.context.request), '[Channel Offline]');
});
