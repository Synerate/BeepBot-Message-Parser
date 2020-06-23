import { Parser } from '..';
import { IMessage } from '../interface';

export type VarType = 'add' | 'incr' | '++' | 'rem' | 'remove' | 'decr' | '--' | 'set';

/**
 * Process a variable argument in a message. This will call upon a callback (passed on constructor) to get a new value for the variable.
 */
// tslint:disable-next-line: max-line-length
export async function variable(this: Parser, message: IMessage, _settings: never, _request: never, varName: string, type: VarType, val: string = null) {
    let shouldReset: boolean = false;
    if (message.message.raw != null && message.message.raw.toLowerCase().includes('--reset')) {
        shouldReset = true;
    }

    return this.opts.varCallback(message.channel.coreId, varName, type, val, shouldReset);
}
