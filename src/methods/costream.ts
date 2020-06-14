import * as config from 'config';

import { IOpts } from '..';
import { IMessage } from '../interface';
import { httpRequest } from '../lib/helpers';

const supportedProviders = ['mixer', 'twitch'];

interface ICoStream {
    channels: {
        id: number;
        token: string;
        userId: number;
    }[];
}

export async function costream(message: IMessage, _settings: any, request: typeof fetch, opts: IOpts['oauth'], withLinks: string = 'true') {
    if (!supportedProviders.includes(message.provider.toLowerCase())) {
        return '[Non-Supported Provider]';
    }
    let showLinks: boolean = true;
    try {
        const res = JSON.parse(withLinks);
        if (typeof res === 'boolean') {
            showLinks = res;
        }
        if (typeof res === 'number') {
            if (res === 1) {
                showLinks = true;
            }
            if (res === 0) {
                showLinks = true;
            }
        }
    } catch {
        showLinks = true;
    }

    return getData(request, message.provider, message.channel.id.toString(), showLinks);
}

async function getData(request: typeof fetch, provider: string, channelId: string, showLinks: boolean): Promise<string> {
    const headers = {
        'Client-ID': config.get<string>(`providers.${provider}.clientId`),
    };
    switch (provider) {
        case 'mixer':
            const mchan = await httpRequest(request, `${config.get<string>('providers.mixer.api')}channels/${channelId}`, headers);
            if (mchan === undefined) {
                return '[API Error]';
            }
            if (mchan.costreamId == null) {
                return '[Channel not Co-Streaming]';
            }
            // tslint:disable-next-line: max-line-length
            const mcost: ICoStream = await httpRequest(request, `${config.get<string>('providers.mixer.api')}costreams/${mchan.costreamId}`, headers);
            if (mcost === undefined) {
                return '[API Error]';
            }

            return mcost.channels.map(channel => {
                if (showLinks) {
                    return `${channel.token} (${config.get<string>('providers.mixer.base')}${channel.token})`;
                }

                return channel.token;
            }).join(', ');
        default:
            return '[Non-Supported Provider]';
    }
}
