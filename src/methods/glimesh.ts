import * as config from 'config';
import { get, isString } from 'lodash';

import { Parser } from '../';
import { IMessage, ISetting } from '../interface';
import { getFromSimple, httpRequest, isValueValid } from '../lib/helpers';

export interface IGlimeshRes {
    data: {
        channel: null | IGlimeshChannel;
        followers: null | IGlimeshFollow[];
    };
    errors: {
        locations: {
            column: number;
            line: number;
        }[];
        message: string;
        path: string[];
    }[];
}

export interface IGlimeshChannel {
    category: {
        name: string;
    };
    title: string;
    streamer: {
        username: string;
    };
    stream: null | IGlimeshStream;
}

export interface IGlimeshFollow {
    insertedAt: string;
}

export interface IGlimeshStream {
    startedAt: string;
}

export async function glimesh(this: Parser, message: IMessage, _settings: ISetting, request: typeof fetch, type: string, channel = message.channel.id) {
    const reqHeaders = {
        Authorization: `Client-ID ${config.get('providers.glimesh.clientId')}`,
    };
    const reqBody = `
        query {
            channel(username: "${channel}") {
                category {
                    name
                }
                title
                streamer {
                    username
                }
            }
        }
    `;

    const req = await httpRequest<IGlimeshRes>(request, config.get('providers.glimesh.api'), { headers: reqHeaders, method: 'POST', body: reqBody });
    if (req == null || isString(req)) {
        return '[Error: API Error]';
    }
    if (req?.data?.channel === null) {
        return '[Error: Invalid Channel]';
    }

    const value = get(req, getFromSimple('glimesh', type), '[Type Not Found]');
    if (!isValueValid(value)) {
        return '[Error: Return Value Invalid]';
    }

    return value;
}
