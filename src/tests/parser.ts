import { test } from 'ava';

import { Parser } from '..';
import { IMessage } from '../interface';
import { VarType } from '../methods/variable';
import { mockMessage, mockSettings } from '../mock';

const testVars: { [name: string]: number } = {
    cheese: 1,
    test: 2,
};

const parser = new Parser({
    varCallback: async (_coreId: string, varName: string, type: VarType) => {
        const val = testVars[varName.toLowerCase()];
        switch (type) {
            case 'incr':
                return val + 1;
            default:
                return val;
        }
    },
});

const messages: { input: string; message?: IMessage; output: string }[] = [
    {
        input: 'Mixer {mixer token}',
        message: { ...mockMessage,  channel: { name: 'artdude543', id: 587 }, provider: 'mixer' },
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
        message: { ...mockMessage,  provider: 'mixer' },
        output: 'Mixer Token! TestUser',
    },
    {
        input: 'Var Testing! {variable cheese}',
        output: 'Var Testing! 1',
    },
    {
        input: 'Var Testing! {variable test}',
        output: 'Var Testing! 2',
    },
    {
        input: 'Var Testing! {variable cheese incr}',
        output: 'Var Testing! 2',
    },
    {
        input: 'Var Testing! {variable cheese} {variable test}',
        output: 'Var Testing! 1 2',
    },
    {
        input: 'Should not cause memory leaks! "',
        output: 'Should not cause memory leaks! "',
    },
];

test('parse the messages', async t => {
    await Promise.all(messages.map(async msg => {
        let message = mockMessage;
        if (msg.message != null) {
            message = msg.message;
        }
        t.is(await parser.parse(message, mockSettings, msg.input), msg.output);
    }));
});
