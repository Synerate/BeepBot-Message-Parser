import * as stream from './channel';
import * as str from './string';
import * as users from './users';

import { beam } from './beam';
import { exoapi } from './exoapi';
import { lastfm } from './lastfm';

export const methods = {
    beam,
    exoapi,
    lastfm,
    ...stream,
    ...str,
    ...users,
};
