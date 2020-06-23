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
export function title(this: Parser, message: IMessage, settings: ISetting, cache: typeof fetch, channel: string = message.channel.name) {
    if (providers[message.provider.toLowerCase()] === undefined) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.toLowerCase()].call(this, message, settings, cache, 'title', channel);
}

/**
 * Get the current game/category being streamed.
 */
export function game(this: Parser, message: IMessage, settings: ISetting, cache: typeof fetch, channel: string = message.channel.name) {
    if (providers[message.provider.toLowerCase()] === undefined) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.toLowerCase()].call(this, message, settings, cache, 'game', channel);
}

/**
 * Get the provider which the message was sent from.
 */
export function provider(message: IMessage) {
    return message.provider;
}
