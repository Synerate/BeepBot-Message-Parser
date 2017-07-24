import * as fetch from 'isomorphic-fetch';

/**
 * Make a http(s) request to a json api.
 *
 * Rejects when a network error occured.
 *
 * @param uri The uri to request the data from.
 * @param headers Headers to attach to the request.
 * @return The body of the response, parsed as json.
 * It returns with `null` when the api does not respond with `200 OK`.
 */
export async function request(
  uri: string,
  headers: { [header: string]: string } = {},
) {
  const req = await fetch(uri, { headers });
  if (req.status !== 200) {
    return null;
  }
  return await req.json();
}

const providerMapping = {
  beam: {
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
 *  Beam: title -> name
 *        game -> type.name
 */
export function getFromSimple(provider: string, toPick: string): string {
  if (providerMapping[provider.toLowerCase()] == null) {
    throw TypeError('Invalid Provider.');
  }
  if (providerMapping[provider.toLowerCase()][toPick.toLowerCase()] == null) {
    return toPick;
  }
  return providerMapping[provider.toLowerCase()][toPick.toLowerCase()];
}
