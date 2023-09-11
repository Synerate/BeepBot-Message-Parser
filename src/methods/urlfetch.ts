import * as config from 'config';
import { get, isObject, sample, truncate } from 'lodash';

import { Parser, ParserContext } from '../';
import { IMessage, ISetting } from '../interface';

const providerLengthLimit: { [ provider: string ]: number } = {
    default: 300,
    discord: 2000,
};

const FETCH_TIMEOUT = 1000 * 15; // 15 seconds

export async function urlfetch(this: Parser, message: IMessage, settings: ISetting, { cache, request }: ParserContext, ...args: string[]) {
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

    /**
     * Create the abort controller and timeout.
     */
    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    return request(workerUri, { body: JSON.stringify(payload), method: 'POST', headers, signal: controller.signal })
        .then(async res => {
            clearTimeout(abortTimeout);

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

                return String(jsonResult);
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
        .then(res => {
            if (res == null) {
                return '[Error: Failed to Parse Response]';
            }

            if (res.includes('urlfetch') || res.includes('urlfetchctx')) {
                return res;
            }

            return this.parse.call(this, message, settings, res);
        })
        .then(res => truncate(String(res), { length: providerLengthLimit[message.provider] || providerLengthLimit.default }))
        .catch(() => {
            clearTimeout(abortTimeout);

            return null;
        });
}

export function urlfetchctx(this: Parser, message: IMessage, _settings: any, { request, cache }: ParserContext, ...args: string[]) {
    const newArgs = [ true, ...args ];

    return urlfetch.call(this, message, _settings, { request, cache }, ...newArgs);
}
