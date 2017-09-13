import { IMessage } from '../interface/message';
import { ISetting } from '../interface/settings';

import * as channel from './channel';
import * as str from './string';
import * as users from './users';

import { exoapi } from './exoapi';
import { lastfm } from './lastfm';
import { mixer } from './mixer';
import { pretzel } from './pretzel';
import { smashcast } from './smashcast';
import { time } from './time';
import { twitch } from './twitch';
import { weather } from './weather';

export const methods = {
    exoapi,
    lastfm,
    mixer,
    pretzel,
    smashcast,
    time,
    twitch,
    weather,
    ...channel,
    ...str,
    ...users,
};
