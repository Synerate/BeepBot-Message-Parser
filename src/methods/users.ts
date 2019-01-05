import { IMessage } from '../interface';

export function user(message: IMessage) {
    return message.user.name;
}

export function touser(message: IMessage) {
    if (message.message.args[1] !== undefined) {
        return message.message.args[1];
    }

    return message.user.name;
}

export function userid(message: IMessage) {
    return message.user.id;
}
