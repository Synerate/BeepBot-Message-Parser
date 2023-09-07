import * as moment from 'moment-timezone';

import { ParserContext } from '../';
import { IMessage, ISetting } from '../interface';

export function time(_message: IMessage, settings: ISetting, _context: ParserContext, timezone: string = settings.timezone, ...args: string[]) {
    const formatParts: string[] = Array.prototype.slice.call(arguments, 4);
    if (moment.tz.zone(timezone) === null) {
        return '[Error: Invalid Timezone]';
    }
    let format = 'ha z';
    if (formatParts.length > 0) {
        format = formatParts.join(' ');
    }

    return moment.tz(new Date(), timezone)
        .format(format);
}
