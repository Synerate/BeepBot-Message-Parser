import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import { cloneDeep } from 'lodash';

import { extralife } from '../../methods/extralife';
import { mockMessage, mockOpts } from '../../mock';

test.beforeEach('create a new mockMessage', (t: any) => {
    t.context = { message: cloneDeep(mockMessage), request: (<any> memoize)(fetch) };
});

test('parse an extralife page', async (t: any) => {
    const message = t.context.message;

    t.not(await extralife(message, null, t.context.request, mockOpts, '400850'), '[API Error]');
    t.not(await extralife(message, null, t.context.request, mockOpts, '400850', 'goal'), '[API Error]');
    t.not(await extralife(message, null, t.context.request, mockOpts, '400850', 'total'), '[API Error]');
    t.is(await extralife(message, null, t.context.request, mockOpts, 'should_error', 'total'), '[API Error]');
});
