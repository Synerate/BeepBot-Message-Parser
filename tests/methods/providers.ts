import { test } from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { IMessage } from '../../src/interface/message';
import { mockMessage, mockSettings } from '../../src/mock';

import { mixer } from '../../src/methods/mixer';
import { smashcast } from '../../src/methods/smashcast';
import { twitch } from '../../src/methods/twitch';

interface ITest {
    provider: string;
    message?: IMessage;
    method: Function;
    tests: {
        channel?: string | number;
        type: string;
        result: string;
    }[];
}

const providers: ITest[] = [
     {
         message: Object.assign({}, mockMessage, { channel: { id: 36297622 }, provider: { type: 'twitch' } }),
         method: twitch,
         provider: 'twitch',
         tests: [
             {
                 result: '[Type Not Found]',
                 type: 'invalid',
             },
             {
                 channel: 'invalid_channel_test',
                 result: '[API Error]',
                 type: 'token',
             },
             {
                 result: 'artdude543',
                 type: 'display_name',
             },
             {
                 result: 'https://www.twitch.tv/artdude543',
                 type: 'url',
             },
             {
                 result: '[Return Value Invalid]',
                 type: 'profile_banner_background_color',
             },
         ],
     },
     {
         message: Object.assign({}, mockMessage, { channel: { id: 587 }, provider: { type: 'mixer' }, user: { id: 693 } }),
         method: mixer,
         provider: 'mixer',
         tests: [
             {
                result: '[Type Not Found]',
                type: 'invalid',
             },
             {
                 channel: 'invalid_channel_test',
                 result: '[API Error]',
                 type: 'token',
             },
             {
                result: 'artdude543',
                type: 'token',
             },
             {
                result: 'artdude543',
                type: 'user.username',
             },
             {
                 result: '[Return Value Invalid]',
                 type: 'type',
             },
         ],
     },
     {
         message: Object.assign({}, mockMessage, { channel: { id: 'artdude543' }, provider: { type: 'smashcast' }, user: { id: 415692 } }),
         method: smashcast,
         provider: 'smashcast',
         tests: [
             {
                result: '[Type Not Found]',
                type: 'invalid',
             },
             {
                 channel: 'invalid_channel_test',
                 result: '[API Error]',
                 type: 'token',
             },
             {
                result: 'artdude543',
                type: 'name',
             },
             {
                result: '415692',
                type: 'livestream.0.channel.user_id',
             },
             {
                 result: '[Return Value Invalid]',
                 type: 'request',
             },
         ],
     },
];

test.beforeEach(t => {
    t.context = { request: (<any> memoize)(fetch) };
});

test('provider tests', async t => {
    await Promise.all(providers.map(provider => {
        return Promise.all(provider.tests.map(async test => {
            const message = JSON.parse(JSON.stringify(provider.message));
            if (test.channel) {
                message.channel.id = test.channel;
            }
            const req = await provider.method(message, mockSettings, t.context.request, test.type, test.channel);
            t.is(req, test.result, `Provider: ${provider.provider} Expected: ${test.result} Got: ${req} Type: ${test.type}`);
        }));
    }));
});
