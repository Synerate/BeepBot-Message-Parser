import { get, isArray } from 'lodash';

import { Parser, ParserContext } from '../';
import { IMessage, ISetting } from '../interface';

export async function ctx(this: Parser, _message: IMessage, _settings: ISetting, { cache }: ParserContext, index: string, pickOpts: string) {
    if (cache == null) {
        return '';
    }

    const safeIndex = isNaN(Number(index)) ? 0 : Number(index);
    const cachedValue = cache[safeIndex];
    if (cachedValue == null) {
        return '';
    }

    if (isArray(cachedValue)) {
        if (pickOpts == null) {
            return '[Error: Missing pick options]';
        }

        return cachedValue[Number(pickOpts)] || '';
    }

    switch (typeof cachedValue) {
        case 'string':
        case 'number':
            return cachedValue;
        case 'object': {
            if (pickOpts == null) {
                return '[Error: Missing pick options]';
            }

            return get(cachedValue, pickOpts) || '[Error: Pick option invalid]';
        }
        default:
            return '[Error: Invalid cache value]';
    }
}
