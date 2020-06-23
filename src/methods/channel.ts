import * as config from 'config';

import { Parser } from '..';
import { IMessage, ISetting } from '../interface';
import { removeTag } from '../lib/helpers';
import { twitch } from './twitch';

const providers: { [provider: string]: (...args: any[]) => Promise<string> } = {
    twitch,
};

export function streamer(message: IMessage) {
    return message.channel.name;
}

export function stream(message: IMessage, _settings: ISetting, _cache: typeof fetch, channel: string = message.channel.name) {
    if (config.has(`providers.${message.provider.toLowerCase()}.base`) === false) {
        return '[Invalid Provider]';
    }

    return `${config.get<string>(`providers.${message.provider.toLowerCase()}.base`)}${removeTag(channel)}`;
}

/**
 * Get the current title of the stream.
 */
export async function title(this: Parser, message: IMessage, settings: ISetting, cache: typeof fetch, channel = message.channel.id) {
    if (providers[message.provider.toLowerCase()] === undefined) {
        return '[Invalid Provider]';
    }

    let channelId: string = channel.toString();

    if (isNaN(Number(channel))) {
        const res = await this.opts.reqCallback(`https://api.twitch.tv/kraken/users?login=${channel}`, {
            coreId: message.channel.coreId,
            method: 'GET',
            serviceId: message.channel.serviceId,
        });
        if (res == null) {
            return '[API Error]';
        }

        channelId = res.users[0]._id;
    }

    return providers[message.provider.toLowerCase()].call(this, message, settings, cache, 'title', channelId);
}

/**
 * Get the current game/category being streamed.
 */
export async function game(this: Parser, message: IMessage, settings: ISetting, cache: typeof fetch, channel = message.channel.id) {
    if (providers[message.provider.toLowerCase()] === undefined) {
        return '[Invalid Provider]';
    }

    let channelId: string = channel.toString();

    if (isNaN(Number(channel))) {
        const res = await this.opts.reqCallback(`https://api.twitch.tv/kraken/users?login=${channel}`, {
            coreId: message.channel.coreId,
            method: 'GET',
            serviceId: message.channel.serviceId,
        });
        if (res == null) {
            return '[API Error]';
        }

        channelId = res.users[0]._id;
    }

    return providers[message.provider.toLowerCase()].call(this, message, settings, cache, 'game', channelId);
}

/**
 * Get the provider which the message was sent from.
 */
export function provider(message: IMessage) {
    return message.provider;
}
