import { Parser, ParserContext } from '../..';
import { IMessage, ISetting } from '../../interface';

export async function currencyadjust(this: Parser, message: IMessage, _settings: ISetting, _context: ParserContext, ...args: string[]) {
    const amount = args.join('');
    if (isNaN(Number(amount))) {
        return '[Amount is not a number]';
    }

    await this.middleware?.onHandleMethod?.('updateCurrency', message, { toChange: Number(amount) })
        .catch(() => undefined);

    return '';
}
