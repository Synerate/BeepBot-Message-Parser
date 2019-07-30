import test from 'ava';
import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';

import { Parser } from '../..';
import { variable, VarType } from '../../methods/variable';
import { mockMessage, mockSettings } from '../../mock';

const testVars: { [name: string]: number } = {
    cheese: 1,
    test: 2,
};

const parser = new Parser({
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
    t.is(await variable.call(parser, mockMessage, mockSettings, t.context.request, 'cheese'), 1);
    t.is(await variable.call(parser, mockMessage, mockSettings, t.context.request, 'cheese', 'incr'), 2);
    t.is(await variable.call(parser, mockMessage, mockSettings, t.context.request, 'test', 'decr'), 1);
    t.is(await variable.call(parser, mockMessage, mockSettings, t.context.request, 'random'), 1);
});
