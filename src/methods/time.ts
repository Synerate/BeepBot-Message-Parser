import * as moment from 'moment';
import 'moment-timezone';

import { IMessage } from '../interface/message';
import { ISetting } from '../interface/settings';

export function time(message: IMessage, settings: ISetting, timezone: string = settings.channel.timezone, ...args: string[]) {
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
