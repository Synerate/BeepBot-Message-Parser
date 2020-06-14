import * as config from 'config';
import { get } from 'lodash';

import { IOpts } from '..';
import { IMessage, ISetting } from '../interface';
import { getFromSimple, httpRequest, isValueValid } from '../lib/helpers';

export async function mixer(message: IMessage, _settings: ISetting, request: typeof fetch, opts: IOpts['oauth'], type: string, channel = message.channel.id) {
    const req = await httpRequest(request,
                                  `${config.get<string>('providers.mixer.api')}channels/${channel}`,
                                  {
                                      'Client-ID': config.get<string>('providers.mixer.clientId'),
                                  });
    if (req === undefined) {
        return '[API Error]';
    }
    const value = get(req, getFromSimple('mixer', type), '[Type Not Found]');
    if (!isValueValid(value)) {
        return '[Return Value Invalid]';
    }

    return value;
}
