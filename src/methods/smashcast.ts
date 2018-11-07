import * as config from 'config';
import { get } from 'lodash';

import { IMessage, ISetting } from '../interface';
import { getFromSimple, httpRequest, isValueValid } from '../lib/helpers';

export async function smashcast(message: IMessage, settings: ISetting, request: typeof fetch, type: string, channel = message.channel.id) {
    const req = await httpRequest(request, `${config.get<string>('providers.smashcast.api')}media/live/${channel}`);
    if (req == null) {
        return '[API Error]';
    }
    const value = get(req, getFromSimple('smashcast', type), '[Type Not Found]');
    if (!isValueValid(value)) {
        return '[Return Value Invalid]';
    }

    return value;
}
