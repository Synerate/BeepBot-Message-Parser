import { IMessage } from '../interface/message';

export function user(msg: IMessage) {
    return msg.user.name;
}

export function touser(msg: IMessage) {
    if (msg.message.args[1] != null) {
        return msg.message.args[1];
    }
    return msg.user.name;
}
