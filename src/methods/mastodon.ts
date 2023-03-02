import * as config from 'config';
import * as countdown from 'countdown';
import { truncate, unescape } from 'lodash';
import * as moment from 'moment';
import { format } from 'util';

import { Parser } from '../';
import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';

const BASE_SEARCH_URL = '%s/api/v2/search?type=accounts&resolve=true&q=%s&limit=1';
const BASE_STATUSES_URL = '%s/api/v1/accounts/%s/statuses?exclude_replies=true&limit=1';

interface ISearch {
    accounts: {
        id: string;
        username: string;
    }[];
    statuses: [];
    hashtags: [];
}

interface IStatus {
    id: string;
    created_at: string;
    url: string;
    content: string;
}

type IType = 'link' | 'text';

export async function mastodon(this: Parser, _message: IMessage, _settings: ISetting, request: typeof fetch, account: string, type: IType = 'text') {
    const headers = {
        Authorization: `Bearer ${config.get('api.mastodon.key')}`,
    };

    const SEARCH_URL = format(BASE_SEARCH_URL, config.get('api.mastodon.base'), account);
    const userAccount: ISearch = await httpRequest<ISearch>(request, SEARCH_URL, { headers });
    if (userAccount == null) {
        return '[Error: API Error]';
    }
    if (userAccount.accounts.length === 0) {
        return '[Error: Invalid Account]';
    }

    const STATUSES_URL = format(BASE_STATUSES_URL, config.get('api.mastodon.base'), userAccount.accounts[0].id);
    const statuses: IStatus[] = await httpRequest<IStatus[]>(request, STATUSES_URL);
    if (statuses == null) {
        return '[Error: API Error]';
    }
    if (statuses.length === 0) {
        return '[Error: No Statuses]';
    }

    const status = statuses[0];

    if (type === 'link') {
        return status.url;
    }

    const contentShort = truncate(status.content.replace(/(<([^>]+)>)/gi, ''), { length: 100 });
    const timeSince = `${countdown(new Date(), moment(status.created_at).toDate()).toString()} ago`;

    return `${unescape(contentShort)} - ${status.url} | ${timeSince}`;
}
