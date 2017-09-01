import * as config from 'config';
import * as _ from 'lodash';

import { IMessage } from '../interface/message';
import { ISetting } from '../interface/settings';
import { httpRequest } from '../lib/helpers';

/**
 * Get channel information for a channel.
 */
export async function getChannel(request: typeof fetch, channel: string, value: string = '') {
    const req = await httpRequest(request, `${config.get<string>('api.exozone.base')}beepbot/v2/channels/${channel}`);
    if (req == null) {
        return '[API Error]';
    }
    switch (value) {
        case 'id':
            return req.id;
        default:
            return req.name;
    }
}

/**
 * Get a quote or a random quote for a channel.
 */
export async function getQuote(request: typeof fetch, channel: string, value: string = '') {
    const req: any[] = await httpRequest(request, `${config.get<string>('api.exozone.base')}beepbot/v2/channels/${channel}/quotes`);
    if (req == null || req.length === 0) {
        return '[API Error]';
    }
    let quote: any;
    switch (value) {
        case 'random':
            quote = _(req).shuffle().sample();

            return `${quote.message}, ${quote.userName}`;
        default:
            if (req.filter(res => res.quoteId === Number(value)).length === 1) {
                quote = req.filter(res => res.quoteId === Number(value))[0];
            } else {
                quote = _(req).shuffle().sample();
            }
    }

    return `${quote.message}, ${quote.userName}`;
}

// tslint:disable-next-line:max-line-length
export async function exoapi(message: IMessage, settings: ISetting, request: typeof fetch, method: string, channel: string, value: string = '') {
    switch (method) {
        case 'channel':
            return getChannel(request, channel, value);
        case 'quote':
            return getQuote(request, channel, value);
        default:
            return '[Invalid Method]';
    }
}
