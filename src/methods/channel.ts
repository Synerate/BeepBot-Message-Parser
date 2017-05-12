import * as config from 'config';

import { IMessage } from '../interface/message';

export function streamer(message: IMessage) {
    return message.channel.name;
}

export function stream(message: IMessage) {
    const provider = config.has(`providers.${message.provider.type.toLowerCase()}.base`);
    if (provider === false) {
        return '[Invalid Provider]';
    }
    return `${config.get<string>(`providers.${message.provider.type.toLowerCase()}.base`)}${message.channel.name}`;
}
