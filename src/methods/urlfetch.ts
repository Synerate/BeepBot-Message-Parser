import { Parser } from '..';
import { IMessage } from '../interface';

export async function urlfetch(this: Parser, message: IMessage, _settings: any, _request: typeof fetch, ...uriArgs: string[]) {
    if (this.opts.reqCustomAPI == null) {
        return '[Custom API Not Supported]';
    }

    const copiedArgs = [ ...uriArgs ];
    copiedArgs.pop();
    const uri = copiedArgs.join('');
    if (uri == null) {
        return '[URI Missing]';
    }
    const pickOpts = uriArgs[uriArgs.length - 1];

    return this.opts.reqCustomAPI(uri, message, pickOpts)
        .then(res => {
            if (res == null) {
                return '[Custom API Error]';
            }

            return res;
        })
        .catch(() => '[Custom API Error]');
}
