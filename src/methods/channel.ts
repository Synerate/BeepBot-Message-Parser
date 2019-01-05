import * as config from 'config';

import { IMessage, ISetting } from '../interface';
import { removeTag } from '../lib/helpers';
import { mixer } from './mixer';
import { smashcast } from './smashcast';
import { twitch } from './twitch';

const providers = {
    mixer,
    smashcast,
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
export function title(message: IMessage, settings: ISetting, cache: typeof fetch) {
    if (providers[message.provider.toLowerCase()] === undefined) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.toLowerCase()](message, settings, cache, 'title', message.channel.id);
}

/**
 * Get the current game/category being streamed.
 */
export function game(message: IMessage, settings: ISetting, cache: typeof fetch) {
    if (providers[message.provider.toLowerCase()] === undefined) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.toLowerCase()](message, settings, cache, 'game', message.channel.id);
}

/**
 * Get the provider which the message was sent from.
 */
export function provider(message: IMessage) {
    return message.provider;
}
