import { test } from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import { cloneDeep } from 'lodash';

import { extralife, parseNum } from '../../methods/extralife';
import { mockMessage } from '../../mock';

test.beforeEach('create a new mockMessage', t => {
    t.context = { message: cloneDeep(mockMessage), request: (<any> memoize)(fetch) };
});

test('parse an extralife page', async t => {
    const message = t.context.message;

    t.not(await extralife(message, null, t.context.request, '347713'), '[API Error]');
    t.not(await extralife(message, null, t.context.request, '347713', 'goal'), '[API Error]');
    t.not(await extralife(message, null, t.context.request, '347713', 'total'), '[API Error]');
    t.is(await extralife(message, null, t.context.request, 'should_error', 'total'), '[API Error]');
});
