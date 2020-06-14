import * as config from 'config';
import { get } from 'lodash';

import { IOpts } from '..';
import { IMessage, ISetting } from '../interface';
import { getFromSimple, httpRequest, isValueValid } from '../lib/helpers';

export async function twitch(message: IMessage, _settings: ISetting, request: typeof fetch, opts: IOpts['oauth'], type: string, channel = message.channel.id) {
    const headers = {
        Accept: 'application/vnd.twitchtv.v5+json',
        Authorization: `OAuth ${opts.twitch}`,
        'Client-ID': config.get<string>('providers.twitch.clientId'),
    };
    const req = await httpRequest(request, `${config.get<string>('providers.twitch.api')}kraken/channels/${channel}`, headers);
    if (req === undefined) {
        return '[API Error]';
    }
    const value = get(req, getFromSimple('twitch', type), '[Type Not Found]');
    if (!isValueValid(value)) {
        return '[Return Value Invalid]';
    }

    return value;
}
