import { test } from 'ava';

import { IMessage } from '../../src/interface/message';
import { mockMessage, mockSettings } from '../../src/mock';

import { beam } from '../../src/methods/beam';
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
                 result: '[Invalid Type]',
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
         ],
     },
     {
         message: Object.assign({}, mockMessage, { channel: { id: 587 }, provider: { type: 'beam' }, user: { id: 693 } }),
         method: beam,
         provider: 'beam',
         tests: [
             {
                result: '[Invalid Type]',
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
         ],
     },
     {
         message: Object.assign({}, mockMessage, { channel: { id: 'artdude543' }, provider: { type: 'smashcast' }, user: { id: 415692 } }),
         method: smashcast,
         provider: 'smashcast',
         tests: [
             {
                result: '[Invalid Type]',
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
         ],
     },
];

test('provider tests', async t => {
    await Promise.all(providers.map(provider => {
        return Promise.all(provider.tests.map(async test => {
            const message = JSON.parse(JSON.stringify(provider.message));
            if (test.channel) {
                message.channel.id = test.channel;
            }
            const req = await provider.method(message, mockSettings, test.type, test.channel);
            t.is(req, test.result, `Provider: ${provider.provider} Expected: ${test.result} Got: ${req} Type: ${test.type}`);
        }));
    }));
});
