import * as moment from 'moment';
// tslint:disable-next-line:no-import-side-effect
import 'moment-timezone';

import { IMessage } from '../interface/message';
import { ISetting } from '../interface/settings';

// tslint:disable-next-line:max-line-length
export function time(message: IMessage, settings: ISetting, request: typeof fetch, timezone: string = settings.channel.timezone, ...args: string[]) {
    const formatParts: string[] = Array.prototype.slice.call(arguments, 4);
    if (moment.tz.zone(timezone) == null) {
        return '[Invalid Timezone]';
    }
    let format = 'ha z';
    if (formatParts.length > 0) {
        format = formatParts.join(' ');
    }

    return moment.tz(new Date(), timezone).format(format);
}
