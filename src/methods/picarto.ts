import { get } from 'lodash';

import { Parser } from '../';
import { IMessage, ISetting } from '../interface';
import { getFromSimple, httpRequest, isValueValid } from '../lib/helpers';

export async function picarto(this: Parser, message: IMessage, _settings: ISetting, request: typeof fetch, type: string, channel = message.channel.id) {
    let uri: string | null = null;

    if (isNaN(Number(channel))) {
       uri = `https://api.picarto.tv/api/v1/channel/name/${channel}`;
    } else {
        uri = `https://api.picarto.tv/api/v1/channel/id/${channel}`;
    }
    if (uri == null) {
        return '[API Error];'
    }

    const req: any = await httpRequest(request, uri);
    if (req == null) {
        return '[Error: API Error]';
    }
    if (req?.user_id === null) {
        return '[Error: Invalid Channel]';
    }

    const value = get(req, getFromSimple('picarto', type), '[Type Not Found]');
    if (!isValueValid(value)) {
        return '[Error: Return Value Invalid]';
    }

    return value;
}
