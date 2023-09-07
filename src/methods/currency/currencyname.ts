import * as pluarlize from 'pluralize';

import { Parser, ParserContext } from '../..';
import { IMessage, ISetting } from '../../interface';

export async function currencyname(this: Parser, message: IMessage, _settings: ISetting, _context: ParserContext, amount: string) {
    const safeAmount = isNaN(Number(amount)) ? 0 : Number(amount);

    if (this.middleware?.onHandleMethod == null) {
        return pluarlize('Point', safeAmount);
    }

    return this.middleware?.onHandleMethod?.('getCurrencyName', message)
        .then(res => pluarlize(res ?? 'Point', safeAmount))
        .catch(() => pluarlize('Point', safeAmount));
}
