import { test } from 'ava';

import { parse } from '../src/';
import { IMessage } from '../src/interface/message';
import { mockMessage, mockSettings } from '../src/mock';

const messages: { input: string; message?: IMessage; output: string; }[] = [
    {
        input: 'Beam {beam token}',
        message: Object.assign({}, mockMessage, { channel: { id: 587 } }),
        output: 'Beam artdude543',
    },
    {
        input: 'I should not "parse"',
        output: 'I should not "parse"',
    },
    {
        input: 'My Name! {user}',
        output: 'My Name! TestUser',
    },
    {
        input: 'Beam Token! {beam token {user}}',
        output: 'Beam Token! TestUser',
    },
];

test('parse the messages', async t => {
    await Promise.all(messages.map(async msg => {
        let message = mockMessage;
        if (msg.message) {
            message = msg.message;
        }
        t.is(await parse(message, mockSettings, msg.input), msg.output);
    }));
});
