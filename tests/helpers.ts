import { test } from 'ava';

import { request } from '../src/lib/helpers';

test('invalid request should be null', async t => {
    const req = await request('https://beam.pro/api/v1/channels/^^%');
    t.is(req, null);
});
