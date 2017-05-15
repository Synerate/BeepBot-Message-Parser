import { test } from 'ava';

import { getFromSimple, request } from '../../src/lib/helpers';

test('invalid request should be null', async t => {
    const req = await request('https://beam.pro/api/v1/channels/^^%');
    t.is(req, null);
});


test('get the correct types from simple', t => {
    // Convert to the complex API values.
    t.is(getFromSimple('beam', 'game'), 'type.name');
    t.is(getFromSimple('beam', 'name'), 'token');
    t.is(getFromSimple('smashcast', 'game'), 'livestream.0.category_name');

    // Return the value given if we don't need to change it.
    t.is(getFromSimple('beam', 'followers'), 'followers');
    t.is(getFromSimple('twitch', 'viewers'), 'viewers');

    // Throw on invalid platform.
    t.throws(() => getFromSimple('hitbox', 'game'), TypeError);
});
