import * as config from 'config';

import { Parser } from '../';
import { IMessage, ISetting } from '../interface';

type SupportedFields = 'raised' | 'description' | 'name' | 'progress' | 'remaining' | 'target' | 'website';

function getCurrency(currency: string): string {
    switch (currency.toLowerCase()) {
        case 'usd':
            return '$';
        case 'gbp':
            return '£';
        default:
            return currency;
    }
}

export const methods = {
    twitch: async (parser: Parser, _request: never, channelId: string, coreId: string, serviceId: string, field: SupportedFields): Promise<string> => {
        if (parser?.middleware?.onServiceAPI == null) {
            return '[Error: API Error]';
        }

        const res = await parser.middleware.onServiceAPI(
            `${config.get<string>('providers.twitch.api')}helix/charity/campaigns?broadcaster_id=${channelId}`, {
                coreId,
                method: 'GET',
                serviceId,
            });

        if (res == null) {
            return '[Error: API Error]';
        }
        if (res.total === 0 || res.data.length === 0) {
            return '[Error: No campaign active]';
        }

        const data = res.data[0];
        const currency = getCurrency(data['current_amount']['currency']);
        const currAmount = Number(data['current_amount']['value']);
        const decimalPlaces = data['current_amount']['decimal_places'] || 2;
        const goalAmount = Number(data['target_amount']['value']);

        if (field != null) {
            switch (field.toLowerCase()) {
                case 'raised':
                    return `${currency}${currAmount.toFixed(decimalPlaces)}`;
                case 'description':
                    return data['charity_description'];
                case 'name':
                    return data['charity_name'];
                case 'progress':
                    return `${(currAmount / goalAmount) * 100}%`;
                case 'remaining':
                    return `${currency}${(goalAmount - currAmount).toFixed(decimalPlaces)}`;
                case 'target':
                    return `${currency}${goalAmount.toFixed(decimalPlaces)}`;
                case 'website':
                    return data['charity_website'];
                default:
                    break;
            }
        }

        return `${data['charity_name']}: ${data['charity_description']} - ${data['charity_website']}`;
    },
};

export function charity(this: Parser, message: IMessage, _settings: ISetting, cache: typeof fetch, field: SupportedFields = null) {
    if (methods[message.provider.toLowerCase()] == null) {
        return '[Error: Invalid Provider]';
    }

    return methods[message.provider.toLowerCase()](this, cache, message.channel.id, message.channel.coreId, message.channel.serviceId, field);
}
