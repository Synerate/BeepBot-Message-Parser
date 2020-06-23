// tslint:disable-next-line:no-import-side-effect no-submodule-imports
import 'source-map-support/register';

import { memoize } from 'decko';
import * as fetch from 'isomorphic-fetch';
import * as MagicString from 'magic-string';

import { parser } from './compiler/parser';
import { tokenizer } from './compiler/tokenizer';
import { IExpression, transformer } from './compiler/transformer';
import { IMessage, ISetting } from './interface';
import { methods } from './methods';
import { VarType } from './methods/variable';

export interface IOpts {
    /**
     * Request callback to ask the provider to send a request and send the data back for the parser to use.
     *
     * @param uri The full path URI on to tell the provider on what to hit to get data needed.
     * @param method The method type for the request.
     * @param coreId The channel coreId in which the request should be sent from.
     * @returns Object/String data which is sent back from the relevant API service called. The method should then translate the data.
     */
    reqCallback(uri: string, method: string, coreId: string): Promise<any>;
    /**
     * Variable callback to process any change(s).
     */
    varCallback(coreId: string, varName: string, type: VarType, val: string, reset: boolean): Promise<number>;
}
export { VarType } from './methods/variable';

export class Parser {
    constructor(public opts: IOpts) {}

    /**
     * Parse the text given to return the parsed generated outputs.
     *
     * This takes data from the message arg (ChannelMessage) from backend. To create
     * some data otherwise the parsers hits various APIs to get the data needed.
     */
    public async parse(message: IMessage, settings: ISetting, text: string) {
        const token = tokenizer(text);
        const parsed = parser(token);
        const transform = transformer(parsed);
        const original = new (<any> MagicString)(text);
        let request = (<any> memoize)(fetch);

        // tslint:disable-next-line:prefer-const
        for (let i = 0, length = transform.body.length; i < length; i++) {
            const part = transform.body[i];
            if (part.type !== 'ExpressionStatement' || methods[part.expression.callee.name.toLowerCase()] === undefined) {
                continue;
            }

            const res = await this.run(request, message, settings, part.expression);
            original.overwrite(part.start, part.end, res.toString());
        }

        // GC
        request = undefined;

        return original.toString();
    }

    /**
     * Run a expression by handling it and returning the generated value.
     *
     * Not all expressions need to be ran to a method so return the expression value.
     */
    private async run(cache: typeof fetch, message: IMessage, settings: ISetting, expr: IExpression) {
        if (expr.type === 'String') {
            return expr.value;
        }
        if (expr.arguments.length === 0) {
            return this.handle(cache, message, settings, expr.callee.name, []);
        }

        const args = await Promise.all(expr.arguments.map(arg => this.run(cache, message, settings, arg)));

        return this.handle(cache, message, settings, expr.callee.name, args);
    }

    /**
     * Handle an expression and return the generated value to be replaced.
     */
    private async handle(cache: typeof fetch, message: IMessage, settings: ISetting, text: string, args: string[] = []): Promise<string> {
        if (methods[text.toLowerCase()] == null) {
            return;
        }

        return methods[text.toLowerCase()].call(this, message, settings, cache, ...args);
    }
}
