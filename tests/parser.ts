import { test } from 'ava';

import { parse } from '../src/';
import { IMessage } from '../src/interface';
import { mockMessage, mockSettings } from '../src/mock';

const messages: { input: string; message?: IMessage; output: string; }[] = [
    {
        input: 'Mixer {mixer token}',
        message: Object.assign({}, mockMessage, { channel: { id: 587 }, provider: { type: 'mixer' } }),
        output: 'Mixer artdude543',
    },
    {
        input: 'I should not "parse"',
        output: 'I should not "parse"',
    },
    {
        input: 'Should ignore an {invalid} parser.',
        output: 'Should ignore an {invalid} parser.',
    },
    {
        input: 'My Name! {user}',
        output: 'My Name! TestUser',
    },
    {
        input: 'Mixer Token! {mixer token {user}}',
        message: Object.assign({}, mockMessage, { provider: { type: 'mixer' } }),
        output: 'Mixer Token! TestUser',
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
