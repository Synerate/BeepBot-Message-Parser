import * as config from 'config';
import { upperFirst } from 'lodash';
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

const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

function getDirection(deg: number) {
    // tslint:disable-next-line:binary-expression-operand-order
    const value = Math.floor(0.5 + (deg / 22.5));

    return directions[(value % 16)];
}

function getTemp(temp: number) {
    return `${temp.toFixed(2)} C (${Number(temp * 9 / 5 + 32).toFixed(2)} F)`;
}

function getSpeed(mps: number) {
    const mph = mps * 2.24;
    const kph = mph * 1.609344;

    return `${mph.toFixed(2)} mph (${kph.toFixed(2)} kph)`;
}

export async function weather(_message: IMessage, _settings: ISetting, request: typeof fetch, region: string) {
    const reqOpts = {
        appid: config.get<string>('api.weather.key'),
        q: region,
        units: 'metric',
    };
    const req: IWeather = await httpRequest(request, `${config.get<string>('api.weather.base')}?${stringify(reqOpts)}`);
    if (req === undefined) {
        return '[API Error]';
    }

    const { main, sys, wind } = req;
    const currWeather = req.weather[0];

    return `Weather for ${req.name}, ${sys.country}: ${upperFirst(currWeather.description)} with a temperature of ${getTemp(main.temp)}. Wind is blowing from the ${getDirection(wind.deg)} at ${getSpeed(wind.speed)}. Humidity is ${main.humidity}%`;
}
