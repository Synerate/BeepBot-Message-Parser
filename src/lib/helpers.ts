import { isArray, isObject } from 'lodash';

 /**
  * @return The body of the response, parsed as json.
  * It returns with `null` when the api does not respond with `200 OK`.
  * @param headers Headers to attach to the request.
  * @param uri The uri to request the data from.
  *
  * 4xx and 5xx response codes are not network errors, and will resolve the promise.
  *
  * Rejects when a network error occurred.
  * Make a http(s) request to a json api.
  */
export async function httpRequest<T>(request: typeof fetch, uri: string, init: RequestInit = {}): Promise<T | string> {
    /**
     * Create the abort controller and timeout.
     */
    const controller = new AbortController();
    const abortTimeout = setTimeout(() => controller.abort(), 1000 * 15);

    return request(uri, { ...init, signal: controller.signal })
        .then(res => {
            clearTimeout(abortTimeout);

            const reqClone = res.clone();
            if (res.status !== 200) {
                return undefined;
            }

            try {
                return res.json();
            } catch (err) {
                return reqClone.text();
            }
        })
        .catch(() => {
            clearTimeout(abortTimeout);

            return undefined;
        });
}

interface MappingData {
    [ provider: string ]: {
        [ key: string ]: string | string[];
    }
}

/**
 * Mapping for provider "channel" API responses.
 *
 * This allows us to offer simple words for awkward types. So the end user
 * does not need to understand how to read an API or learn to use a provider
 * API to get the response in the first place.
 */
const providerMapping: MappingData = {
    trovo: {
        game: 'category_name',
        name: 'username',
        title: 'live_title',
    },
    twitch: {
        game: 'game_name',
        name: 'broadcaster_name',
        title: 'title',
    },
    picarto: {
        game: 'category[0]',
        name: 'name',
        title: 'title',
    },
    kick: {
        game: [
            'livestream.categories[0].name',
            'recent_categories[0].name',
        ],
        title: [
            'livestream.session_title',
            'previous_livestreams[0].session_title',
        ],
        name: 'user.username',
    },
};

/**
 * Allow the user to use simple naming for the various names that the provider API gives.
 * This will then convert the "short/easy" name given to the actual name on the response.
 *
 * This way the users don't have to remember or look at the APIs to get the correct naming.
 */
export function getFromSimple(provider: string, toPick: string) {
    if (providerMapping[provider.toLowerCase()] === undefined) {
        throw TypeError('Invalid Provider.');
    }
    if (providerMapping[provider.toLowerCase()][toPick.toLowerCase()] === undefined) {
        return toPick;
    }

    return providerMapping[provider.toLowerCase()][toPick.toLowerCase()];
}

/**
 * Checks that the value given is valid.
 *
 * Basically only allows single values to be returned. I.E. Number,String,Boolean
 */
export function isValueValid(value: any): boolean {
    if (isArray(value) || isObject(value) || value === null) {
        return false;
    }

    return true;
}

/**
 * Remove common tags from a user/channel name.
 */
export function removeTag(user: string) {
    if (user == null) {
        return '';
    }

    return user.replace('#', '')
        .replace('@', '');
}
