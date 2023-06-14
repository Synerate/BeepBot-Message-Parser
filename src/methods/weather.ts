import * as config from 'config';
import { isString } from 'lodash';
import { stringify } from 'querystring';

import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';

interface IWeather {
    coord: {
        lon: number;
        lat: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number;
        grnd_level: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust: number;
    };
    clouds: {
        all: number;
    };
    rain: {
        '1h': number;
        '2h': number;
    };
    snow: {
        '1h': number;
        '2h': number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        message: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

const directions = [
    'North',
    'North (North-East)',
    'North East',
    'East (North-East)',
    'East',
    'East (South-East)',
    'South East',
    'South (South-East)',
    'South',
    'South (South-West)',
    'South West',
    'West (South-West)',
    'West',
    'West (North-West)',
    'North West',
    'North (North-West)',
];

const getDirection = (deg: number) => directions[(Math.floor(0.5 + (deg / 22.5)) % 16)];

const getTemp = (temp: number) => `${temp.toFixed(2)} °C (${Number(temp * 9 / 5 + 32).toFixed(2)} °F)`;

export async function weather(_message: IMessage, _settings: ISetting, request: typeof fetch, region: string) {
    const reqOpts = {
        appid: config.get<string>('api.weather.key'),
        q: region,
        units: 'metric',
    };
    const req = await httpRequest<IWeather>(request, `${config.get<string>('api.weather.base')}?${stringify(reqOpts)}`);
    if (req === undefined || isString(req)) {
        return '[Error: API Error]';
    }

    const { main, sys, wind } = req;

    return `${req.name}, ${sys.country}: ${getTemp(main.temp)}. Feels like ${getTemp(main.feels_like)}. Wind is blowing from the ${getDirection(wind.deg)}. ${main.humidity}% humidity. Air pressure: ~${main.pressure} hPa.`;
}
