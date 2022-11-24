import * as config from 'config';
import * as countdown from 'countdown';
import * as moment from 'moment';

import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';

interface IResult {
    data: {
        id: string;
        text: string;
        created_at: string;
    }[];
    meta: {
        result_count: number;
    };
}

const buildQuery = (account: string) => `from:${account} -is:retweet -is:reply`;

export function tweet(_message: IMessage, _settings: ISetting, request: typeof fetch, account: string) {
    if (account == null) {
        return '[Error: Account is required]';
    }

    const uri = `${config.get('api.twitter.base')}2/tweets/search/recent?query=${encodeURIComponent(buildQuery(account))}&tweet.fields=created_at`;
    const headers = {
        Authorization: `Bearer ${config.get('api.twitter.key')}`,
    };

    return httpRequest<IResult>(request, uri, { headers })
        .then((res: IResult) => {
            if (res == null) {
                return '[Error: No response from Twitter]';
            }

            if (res?.meta?.result_count === 0) {
                return '[Error: User not found]';
            }

            const timeSince = countdown(new Date(), moment(new Date(res.data[0].created_at)).toDate());

            return `${account} - https://twitter.com/${account}/status/${res.data[0].id} | ${timeSince}`;
        })
        .catch(() => {
            return '[Error: No response from Twitter]';
        });
}
