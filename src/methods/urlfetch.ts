import { Parser } from '../';
import { IMessage } from '../interface';

export async function urlfetch(this: Parser, message: IMessage, _settings: any, _request: typeof fetch, ...uriArgs: string[]) {
    if (this?.middleware?.onExternalAPI == null) {
        return '[Error: Custom API Not Supported]';
    }

    const clonedArgs = [ ...uriArgs ];
    let uri = '';
    let pickOpts: string = null;

    for (let i = 0; i < clonedArgs.length; i++) {
        if (i === (clonedArgs.length - 1) && clonedArgs[i].startsWith('!')) {
            pickOpts = clonedArgs[i].substring(1);

            continue;
        }

        uri += clonedArgs[i];
    }

    if (uri == null || uri.length < 1) {
        return '[Error: URI Missing]';
    }

    return this.middleware.onExternalAPI(uri, message, pickOpts)
        .then(res => {
            if (res == null) {
                return '[Error: API Error]';
            }

            return res;
        })
        .catch(() => '[Error: API Error]');
}
