import { IMessage } from '../interface';

const supportedProviders = [
    'twitch',
];

export async function costream(message: IMessage, _settings: any, _request: never, withLinks: string = 'true') {
    if (!supportedProviders.includes(message.provider.toLowerCase())) {
        return '[Error: Invalid Provider]';
    }

    let showLinks: boolean = true;
    try {
        const res = JSON.parse(withLinks);
        if (typeof res === 'boolean') {
            showLinks = res;
        }
        if (typeof res === 'number') {
            if (res === 1) {
                showLinks = true;
            }
            if (res === 0) {
                showLinks = true;
            }
        }
    } catch {
        showLinks = true;
    }

    return getData(message.provider);
}

async function getData(provider: string): Promise<string> {
    switch (provider) {
        default:
            return '[Error: Invalid Provider]';
    }
}
