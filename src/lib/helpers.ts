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
// tslint:disable-next-line: max-line-length
export async function httpRequest<T>(request: typeof fetch, uri: string, headers: { [header: string]: string } = {}): Promise<T | any> {
    const req = await request(uri, { headers });
    if (req.status !== 200) {
        return undefined;
    }

    try {
        return await req.clone()
            .json();
    } catch (err) {
        return req.clone()
            .text();
    }
}

/**
 * Mapping for provider "channel" API responses.
 *
 * This allows us to offer simple words for awkward types. So the end user
 * does not need to understand how to read an API or learn to use a provider
 * API to get the response in the first place.
 */
const providerMapping = {
    mixer: {
        game: 'type.name',
        name: 'token',
        title: 'name',
    },
    smashcast: {
        game: 'livestream.0.category_name',
        name: 'livestream.0.media_display_name',
        title: 'livestream.0.media_status',
    },
    twitch: {
        game: 'game',
        name: 'display_name',
        title: 'status',
    },
};

/**
 * Allow the user to use simple naming for the various names that the provider API gives.
 * This will then convert the "short/easy" name given to the actual name on the response.
 *
 * This way the users don't have to remember or look at the APIs to get the correct naming.
 *
 * I.E.
 *  Mixer: title -> name
 *        game -> type.name
 */
export function getFromSimple(provider: string, toPick: string): string {
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
