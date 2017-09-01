import * as config from 'config';

import { IMessage } from '../interface/message';
import { ISetting } from '../interface/settings';
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

export function stream(message: IMessage) {
    if (config.has(`providers.${message.provider.type.toLowerCase()}.base`) === false) {
        return '[Invalid Provider]';
    }

    return `${config.get<string>(`providers.${message.provider.type.toLowerCase()}.base`)}${message.channel.name}`;
}

/**
 * Get the current title of the stream.
 */
export function title(message: IMessage, settings: ISetting, cache: typeof fetch) {
    if (providers[message.provider.type.toLowerCase()] == null) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.type.toLowerCase()](message, settings, cache, 'title', message.channel.id);
}

/**
 * Get the current game/category being streamed.
 */
export function game(message: IMessage, settings: ISetting, cache: typeof fetch) {
    if (providers[message.provider.type.toLowerCase()] == null) {
        return '[Invalid Provider]';
    }

    return providers[message.provider.type.toLowerCase()](message, settings, cache, 'game', message.channel.id);
}

/**
 * Get the provider which the message was sent from.
 */
export function provider(message: IMessage) {
    return message.provider.type;
}
