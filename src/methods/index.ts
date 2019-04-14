import * as channel from './channel';
import { extralife } from './extralife';
import { followage } from './followage';
import { lastfm } from './lastfm';
import { mixer } from './mixer';
import { pretzel } from './pretzel';
import { smashcast } from './smashcast';
import * as str from './string';
import { time } from './time';
import { twitch } from './twitch';
import { uptime } from './uptime';
import * as users from './users';
import { variable } from './variable';
import { weather } from './weather';

export const methods = {
    ...channel,
    extralife,
    followage,
    lastfm,
    mixer,
    pretzel,
    smashcast,
    ...str,
    time,
    twitch,
    uptime,
    ...users,
    variable,
    weather,
};
