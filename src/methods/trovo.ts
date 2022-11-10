import * as config from 'config';
import { get } from 'lodash';

import { Parser } from '../';
import { IMessage, ISetting } from '../interface';
import { getFromSimple, httpRequest, isValueValid } from '../lib/helpers';

export async function trovo(this: Parser, message: IMessage, _settings: ISetting, request: typeof fetch, type: string, channel = message.channel.id) {
    const reqHeaders = {
        Accept: 'application/json',
        'Client-ID': config.get<string>('providers.trovo.clientId'),
    };

    const reqBody = {};
    if (isNaN(Number(channel))) {
        reqBody['username'] = channel;
    } else {
        reqBody['channel_id'] = channel;
    }

    const req: any = await httpRequest(request, `${config.get('providers.trovo.api')}/openplatform/channels/id`, { headers: reqHeaders, method: 'POST', body: JSON.stringify(reqBody) });
    if (req == null) {
        return '[Error: API Error]';
    }
    if (req?.data?.channel === null) {
        return '[Error: Invalid Channel]';
    }

    const value = get(req, getFromSimple('trovo', type), '[Type Not Found]');
    if (!isValueValid(value)) {
        return '[Error: Return Value Invalid]';
    }

    return value;
}
