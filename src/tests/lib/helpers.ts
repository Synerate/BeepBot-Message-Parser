import { test } from 'ava';
import * as fetch from 'isomorphic-fetch';

import { getFromSimple, httpRequest } from '../../lib/helpers';

test('invalid request should be null', async t => {
    const req = await httpRequest(fetch, 'https://mixer.com/api/v1/channels/^^%');
    t.is(req, undefined);
});

test('get the correct types from simple', t => {
    // Convert to the complex API values.
    t.is(getFromSimple('mixer', 'game'), 'type.name');
    t.is(getFromSimple('mixer', 'name'), 'token');
    t.is(getFromSimple('smashcast', 'game'), 'livestream.0.category_name');

    // Return the value given if we don't need to change it.
    t.is(getFromSimple('mixer', 'followers'), 'followers');
    t.is(getFromSimple('twitch', 'viewers'), 'viewers');

    // Throw on invalid platform.
    t.throws(() => getFromSimple('hitbox', 'game'), TypeError);
});
