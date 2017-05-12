import * as config from 'config';
import * as _ from 'lodash';

import { IMessage } from '../interface/message';
import { request } from '../lib/helpers';

/**
 * Get channel information for a channel.
 */
export async function getChannel(channel: string, value: string = '') {
    const req = await request(`${config.get<string>('api.exozone.base')}channels/${channel}`);
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
export async function getQuote(channel: string, value: string = '') {
    const req: any[] = await request(`${config.get<string>('api.exozone.base')}channels/${channel}/quotes`);
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

export async function exoapi(message: IMessage, settings: any, method: string, channel: string, value: string = '') {
    switch (method) {
        case 'channel':
            return getChannel(channel, value);
        case 'quote':
            return getQuote(channel, value);
        default:
            return '[Invalid Method]';
    }
}
