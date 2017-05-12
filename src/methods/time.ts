import * as moment from 'moment';
import 'moment-timezone';

import { IMessage } from '../interface/message';

export function time(message: IMessage, settings: any, timezone: string = settings.channel.locale, ...args: string[]) {
    const formatParts: string[] = Array.prototype.slice.call(arguments, 3);
    if (moment.tz.zone(timezone) == null) {
        return '[Invalid Timezone]';
    }
    let format = 'ha z';
    if (formatParts.length > 0) {
        format = formatParts.join(' ');
    }
    return moment.tz(new Date(), timezone).format(format);
}
