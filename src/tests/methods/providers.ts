import { test } from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { IMessage } from '../../interface';
import { mockMessage, mockSettings } from '../../mock';

import { mixer } from '../../methods/mixer';
import { smashcast } from '../../methods/smashcast';
import { twitch } from '../../methods/twitch';

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
         message: { ...mockMessage,  channel: { id: 36297622, name: '' }, provider: 'twitch' },
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
         message: {...mockMessage,  channel: { id: 587, name: '' }, provider: 'mixer', user: { id: 693, name: '' }},
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
         message: {...mockMessage,  channel: { id: 'artdude543', name: '' }, provider: 'smashcast', user: { id: 415692, name: '' }},
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
        return Promise.all(provider.tests.map(async toTest => {
            const message = JSON.parse(JSON.stringify(provider.message));
            if (toTest.channel) {
                message.channel.id = toTest.channel;
            }
            const req = await provider.method(message, mockSettings, t.context.request, toTest.type, toTest.channel);
            t.is(req, toTest.result, `Provider: ${provider.provider} Expected: ${toTest.result} Got: ${req} Type: ${toTest.type}`);
        }));
    }));
});
