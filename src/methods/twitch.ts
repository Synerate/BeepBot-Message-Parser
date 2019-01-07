import * as config from 'config';
import { get } from 'lodash';

import { IMessage, ISetting } from '../interface';
import { getFromSimple, httpRequest, isValueValid } from '../lib/helpers';

export async function twitch(message: IMessage, _settings: ISetting, request: typeof fetch, type: string, channel = message.channel.id) {
    const req = await httpRequest(request, `${config.get<string>('providers.twitch.api')}kraken/channels/${channel}`,
                                  {
                                    Accept: 'application/vnd.twitchtv.v5+json',
                                    'Client-ID': config.get<string>('providers.twitch.clientId'),
                                  },
                                 );
    if (req === undefined) {
        return '[API Error]';
    }
    const value = get(req, getFromSimple('twitch', type), '[Type Not Found]');
    if (!isValueValid(value)) {
        return '[Return Value Invalid]';
    }

    return value;
}
