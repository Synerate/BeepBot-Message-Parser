import { IMessage, ISetting } from '../interface';

import * as channel from './channel';
import * as str from './string';
import * as users from './users';

import { followage } from './followage';
import { lastfm } from './lastfm';
import { mixer } from './mixer';
import { pretzel } from './pretzel';
import { smashcast } from './smashcast';
import { time } from './time';
import { twitch } from './twitch';
import { uptime } from './uptime';
import { variable } from './variable';
import { weather } from './weather';

export const methods = {
    followage,
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
    uptime,
    variable,
};
