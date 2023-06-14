import * as channel from './channel';
import { charity } from './charity';
import { costream } from './costream';
import { extralife } from './extralife';
import { followage } from './followage';
import { glimesh } from './glimesh';
import { kick } from './kick';
import { lastfm } from './lastfm';
import { mastodon } from './mastodon';
import { picarto } from './picarto';
import { pretzel } from './pretzel';
import { randomuser } from './randomuser';
import * as str from './string';
import { tiktok } from './tiktok';
import { time } from './time';
import { trovo } from './trovo';
import { tweet } from './tweet';
import { twitch } from './twitch';
import { uptime } from './uptime';
import { urlfetch } from './urlfetch';
import * as users from './users';
import { variable } from './variable';
import { weather } from './weather';

export const methods = {
    ...channel,
    charity,
    costream,
    extralife,
    followage,
    glimesh,
    kick,
    lastfm,
    mastodon,
    picarto,
    pretzel,
    randomuser,
    tiktok,
    ...str,
    time,
    trovo,
    twitch,
    tweet,
    uptime,
    urlfetch,
    ...users,
    variable,
    weather,
};
