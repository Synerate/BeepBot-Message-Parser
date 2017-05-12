import { ITokens } from './tokenizer';
import { IExpression } from './transformer';

export interface IAst {
    _context?: any;
    body: {
        name?: string;
        params?: string[];
        type?: string;
        value?: string;
        expression?: IExpression;

        start?: number;
        end?: number;
    }[];
    type: string;
}

export function parser(tokens: ITokens[]) {
    let current = 0;

    function walk() {
        let token = tokens[current];

        if (token.type === 'string') {
            current++;
            return {
                type: 'String',
                value: token.value,
            };
        }

        if (token.type === 'paren' && token.value === '{') {
            token = tokens[++current];
            const node = {
                end: 0,
                name: token.value,
                params: [],
                start: tokens[current - 1].position,
                type: 'Method',
            };

            token = tokens[++current];

            while ((token.type !== 'paren') || (token.type === 'paren' && token.value !== '}')) {
                node.params.push(walk());
                token = tokens[current];
            }
            node.end = token.position + 1;
            current++;
            return node;
        }

        throw new TypeError(token.type);
    }

    const ast: IAst = {
        body: [],
        type: 'Program',
    };
    while (current < tokens.length) {
        ast.body.push(walk());
    }

    return ast;
}
