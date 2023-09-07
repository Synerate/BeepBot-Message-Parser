import { ParserContext } from '../';
import { IMessage, ISetting } from '../interface';
import { removeTag } from '../lib/helpers';

export function user(message: IMessage) {
    return message.user.name;
}

export function touser(message: IMessage, _settings: ISetting, _context: ParserContext, noDefault: boolean = false) {
    if (message.message.args[1] !== undefined) {
        if (message.provider === 'discord') {
            return `<@${message.user.id}>`;
        }

        return removeTag(message.message.args[1]);
    }

    if (message.provider === 'discord') {
        return `<@${message.user.id}>`;
    }

    if (noDefault) {
        return '';
    }

    return message.user.name;
}

export function userid(message: IMessage) {
    return message.user.id;
}
