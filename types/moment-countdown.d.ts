// tslint:disable-next-line:no-require-imports
import moment = require('moment');

declare module 'moment' {
    // tslint:disable-next-line:interface-name
    interface Moment {
        (): moment.Moment;
        countdown(): Moment;
        countdown(date: Date): Moment;
    }
}
