import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import { cloneDeep } from 'lodash';

import { Parser, VarType } from '../..';
import { followage } from '../../methods/followage';
import { mockMessage } from '../../mock';

const parser = new Parser({
    oauth: {
        twitch: null,
    },
    varCallback: async (_coreId: string, varName: string, type: VarType) => {
        return null;
    },
});

test.beforeEach('create a new mockMessage', (t: any) => {
    t.context = { message: cloneDeep(mockMessage), request: (<any> memoize)(fetch) };
});

test('handle a non-follower', async (t: any) => {
    const mixer = t.context.message;
    mixer.channel.id = 283247;
    mixer.user.id = 693;
    mixer.provider = 'mixer';

    t.is(await followage.call(parser, mixer, undefined, t.context.request), '[User Not Following]');
});

test('handle a follower', async (t: any) => {
    const mixer = t.context.message;
    mixer.channel.id = 3181;
    mixer.user.id = 280486;
    mixer.provider = 'mixer';
    t.not(await followage.call(parser, mixer, undefined, t.context.request), '[User Not Following]');
});

test('handle a bad-provider', async (t: any) => {
    const message = t.context.message;
    message.channel.id = 1;
    message.user.id = 280486;
    message.provider = 'cheese';

    t.is(await followage.call(parser, message, undefined, t.context.request), '[API Error]');
});
