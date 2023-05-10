import * as config from 'config';
import { get } from 'lodash';

import { Parser } from '../';
import { IMessage, ISetting } from '../interface';
import { getFromSimple, httpRequest, isValueValid } from '../lib/helpers';

export async function kick(this: Parser, message: IMessage, _settings: ISetting, request: typeof fetch, type: string, channelId = message.channel.id) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    const res: any = await httpRequest(request, `${config.get<string>('providers.kickProxy.api')}v1/channels/${String(channelId).toLowerCase()}`, { headers });
    if (res == null) {
        return '[Error: API Error]';
    }
    if (res?.data?.channel === null) {
        return '[Error: Invalid Channel]';
    }

    const pickValue = getFromSimple('kick', type);
    if (Array.isArray(pickValue)) {
        for (const value of pickValue) {
            const val = get(res, value, null);
            if (val == null) {
                continue;
            }

            if (isValueValid(val)) {
                return val;
            }
        }
    } else {
        const value = get(res, pickValue, '[Type Not Found]');
        if (!isValueValid(value)) {
            return '[Error: Return Value Invalid]';
        }

        return value;
    }

    return '[Type Not Found]';
}
