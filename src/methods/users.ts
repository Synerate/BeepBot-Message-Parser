import { IMessage } from '../interface';
import { removeTag } from '../lib/helpers';

export function user(message: IMessage) {
    return message.user.name;
}

export function touser(message: IMessage) {
    if (message.message.args[1] !== undefined) {
        return removeTag(message.message.args[1]);
    }

    if (message.provider === 'discord') {
        return `<@${message.user.id}>`;
    }

    return message.user.name;
}

export function userid(message: IMessage) {
    return message.user.id;
}
