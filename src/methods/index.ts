import * as stream from './channel';
import * as str from './string';
import * as users from './users';

import { exoapi } from './exoapi';
import { lastfm } from './lastfm';
import { mixer } from './mixer';
import { smashcast } from './smashcast';
import { twitch } from './twitch';

export const methods = {
    exoapi,
    lastfm,
    mixer,
    smashcast,
    twitch,
    ...stream,
    ...str,
    ...users,
};
