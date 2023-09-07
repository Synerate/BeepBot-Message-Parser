import * as config from 'config';
import { get, isObject, sample, truncate } from 'lodash';

import { Parser, ParserContext } from '../';
import { IMessage } from '../interface';

const providerLengthLimit: { [ provider: string ]: number } = {
    default: 300,
    discord: 2000,
};

export async function urlfetch(this: Parser, message: IMessage, _settings: any, { cache, request }: ParserContext, ...args: string[]) {
    const workerUri: string = config.get('urlfetch.workerUri');
    if (workerUri == null) {
        return '[Error: Custom API Not Supported]';
    }

    const onlyContext = typeof args[0] === 'boolean' && args[0] === true;
    const customUrl = onlyContext ? args[1] : args[0];
    if(customUrl == null || customUrl.length < 1) {
        return '[Error: URL Missing]';
    }
    const pickOpts = onlyContext ? args[2] : args[1];

    /**
     * Get headers from middleware.
     */
    let headers = {
        ...this.middleware?.onGetHeaders != null ? await this.middleware.onGetHeaders(message) : {},
        'Content-Type': 'application/json',
    };

    /**
     * Build the payload to send to the worker.
     */
    const payload = {
        method: 'GET',
        url: customUrl,
    };

    return request(workerUri, { body: JSON.stringify(payload), method: 'POST', headers })
        .then(async res => {
            const cloned = res.clone();
            const textData = await cloned.text();

            try {
                const jsonData = JSON.parse(textData);
                if (onlyContext) {
                    cache.push(jsonData);

                    return '';
                }

                if (pickOpts == null || pickOpts.length < 1) {
                    return '[Error: Pick Option Missing]';
                }

                const jsonResult = get(jsonData, pickOpts);
                if (jsonResult == null) {
                    return '[Error: Pick Option Invalid]';
                }

                if (isObject(jsonResult)) {
                    return '[Error: Object Returns Disallowed]';
                }

                return truncate(String(jsonResult), { length: providerLengthLimit[message.provider] || providerLengthLimit.default });
            } catch {
                const textLines = textData.split('\n');
                if (onlyContext) {
                    cache.push(textLines);

                    return '';
                }
                if (pickOpts == null || pickOpts.length < 1) {
                    return textLines[0];
                }

                if ((pickOpts === 'rand' || pickOpts === 'random')) {
                    return sample(textLines);
                }
                if (!isNaN(Number(pickOpts))) {
                    return textLines[Number(pickOpts)] || '[Error: Pick Option Invalid]';
                }

                return textLines[0];
            }
        })
        .catch(() => null);
}

export function urlfetchctx(this: Parser, message: IMessage, _settings: any, { request, cache }: ParserContext, ...args: string[]) {
    const newArgs = [ true, ...args ];

    return urlfetch.call(this, message, _settings, { request, cache }, ...newArgs);
}
