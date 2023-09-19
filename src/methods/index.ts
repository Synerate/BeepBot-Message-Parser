import * as channel from './channel';
import { charity } from './charity';
import { costream } from './costream';
import { ctx } from './ctx';
import { currency } from './currency/currency';
import { currencyadjust } from './currency/currencyadjust';
import { currencyname } from './currency/currencyname';
import { extralife } from './extralife';
import { followage } from './followage';
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
import { twitch } from './twitch';
import { uptime } from './uptime';
import { urlfetch, urlfetchctx } from './urlfetch';
import * as users from './users';
import { variable } from './variable';
import { weather } from './weather';

export const methods = {
    ...channel,
    charity,
    costream,
    extralife,
    followage,
    ctx,
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
    uptime,
    urlfetch,
    urlfetchctx,
    ...users,
    variable,
    weather,

    // Currency
    currency,
    currencyadjust,
    currencyname,
};
