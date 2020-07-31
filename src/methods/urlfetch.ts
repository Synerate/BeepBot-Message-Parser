import { Parser } from '..';
import { IMessage } from '../interface';

export async function urlfetch(this: Parser, message: IMessage, _settings: any, _request: typeof fetch, uri: string, pickOpts: string = null) {
    if (uri == null) {
        return '[URI Missing]';
    }
    if (this.opts.reqCustomAPI == null) {
        return '[Custom API Not Supported]';
    }

    return this.opts.reqCustomAPI(uri, message, pickOpts)
        .then(res => {
            if (res == null) {
                return '[Custom API Error]';
            }

            return res;
        })
        .catch(() => '[Custom API Error]');
}
