import * as channel from './channel';
import { costream } from './costream';
import { extralife } from './extralife';
import { followage } from './followage';
import { lastfm } from './lastfm';
import { pretzel } from './pretzel';
import { randomuser } from './randomuser';
import * as str from './string';
import { time } from './time';
import { twitch } from './twitch';
import { uptime } from './uptime';
import { urlfetch } from './urlfetch';
import * as users from './users';
import { variable } from './variable';
import { weather } from './weather';

export const methods = {
    ...channel,
    costream,
    extralife,
    followage,
    lastfm,
    pretzel,
    randomuser,
    ...str,
    time,
    twitch,
    uptime,
    urlfetch,
    ...users,
    variable,
    weather,
};
