import { Parser } from '../..';
import { IMessage, ISetting } from '../../interface';

export async function currency(this: Parser, message: IMessage, _settings: ISetting) {
    return this.middleware?.onHandleMethod?.('getUserCurrency', message)
        .then(res => res ?? '0')
        .catch(() => '');
}
