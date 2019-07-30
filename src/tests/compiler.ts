import test from 'ava';

import { IAst, parser } from '../compiler/parser';
import { ITokens } from '../compiler/tokenizer';
import { traverser } from '../compiler/traverser';

const ast: IAst = {
    body: [{
        name: 'test',
        type: 'Number',
    }],
    type: 'Program',
};

test('traverser throws an invalid type', (t: any) => {
    t.throws(() => traverser(ast, {}), TypeError);
});

test('parser throws an invalid type', (t: any) => {
    const tokens: ITokens[] = [
        {
            position: 1,
            type: 'Number',
            value: '10',
        },
        {
            position: 4,
            type: 'String',
            value: 'Test',
        },
    ];
    t.throws(() => parser(tokens), TypeError);
});
