import { Parser } from '../index';
import { IMessage } from '../interface';

export type VarType = 'set' | '=' | 'add' | '+' | 'incr' | '++' | 'decr' | '--';

/**
 * Process a variable argument in a message. This will call upon a callback (passed on constructor) to get a new value for the variable.
 */
export async function variable(this: Parser, message: IMessage, _settings: never, _request: never, varName: string, type: VarType) {
    return this.opts.varCallback(message.channel.coreId, varName, type);
}
