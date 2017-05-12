import { IAst } from './parser';
import { traverser } from './traverser';

export interface IExpression {
    // tslint:disable-next-line:no-banned-terms
    arguments?: IExpression[];
    // tslint:disable-next-line:no-banned-terms
    callee?: {
        name: string;
        type: string;
    };
    type: string;
    expression?: IExpression;
    value?: string;

    start: number;
    end: number;
}

export function transformer(ast: IAst) {
    const newAst: IAst = {
        body: [],
        type: 'Program',
    };

    ast._context = newAst.body;

    traverser(ast, {
        Method: {
            enter(node, parent) {
                let expression: IExpression = {
                    arguments: [],
                    callee: {
                        name: node.name,
                        type: 'Identifier',
                    },
                    end: node.end,
                    start: node.start,
                    type: 'CallExpression',
                };

                node._context = expression.arguments;

                if (parent.type !== 'Method') {
                    expression = {
                        end: node.end,
                        expression,
                        start: node.start,
                        type: 'ExpressionStatement',
                    };
                }
                parent._context.push(expression);
            },
        },
        String: {
            enter(node, parent) {
                parent._context.push({
                    type: 'String',
                    value: node.value,
                });
            },
        },
    });

    return newAst;
}
