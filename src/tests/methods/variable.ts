import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { Parser } from '../..';
import { variable, VarType } from '../../methods/variable';
import { mockMessage, mockOpts, mockSettings } from '../../mock';

const testVars: { [name: string]: number } = {
    cheese: 1,
    test: 2,
};

const parser = new Parser({
    oauth: {
        twitch: null,
    },
    varCallback: async (_coreId: string, varName: string, type: VarType) => {
        const val = testVars[varName.toLowerCase()];
        if (testVars[varName.toLowerCase()] === undefined) {
            return 1;
        }
        switch (type) {
            case 'incr':
                return val + 1;
            case 'decr':
                return val - 1;
            default:
                return val;
        }
    },
});

test.beforeEach((t: any) => {
    t.context = { request: (<any> memoize)(fetch) };
});

test('parse variable', async (t: any) => {
    t.is(await variable.call(parser, mockMessage, mockSettings, t.context.request, mockOpts, 'cheese'), 1);
    t.is(await variable.call(parser, mockMessage, mockSettings, t.context.request, mockOpts, 'cheese', 'incr'), 2);
    t.is(await variable.call(parser, mockMessage, mockSettings, t.context.request, mockOpts, 'test', 'decr'), 1);
    t.is(await variable.call(parser, mockMessage, mockSettings, t.context.request, mockOpts, 'random'), 1);
});

test('handle reset', async (t: any) => {
    mockMessage.message.raw = '!var test --reset';

    t.is(await variable.call(parser, mockMessage, mockSettings, t.context.request, mockOpts, 'cheese'), 1);
});
