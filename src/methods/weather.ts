import * as config from 'config';
import { stringify } from 'querystring';

import { IMessage, ISetting } from '../interface';
import { httpRequest } from '../lib/helpers';

interface IWeather {
    coord: { lon: number; lat: number };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    base: string;
    main: { temp: number; pressure: number; humidity: number; temp_min: number; temp_max: number };
    visibility: number;
    wind: { speed: number; deg: number };
    clouds: { all: number };
    dt: number;
    sys: { type: number; id: number; message: number; country: string; sunrise: number; sunset: number };
    id: number;
    name: string;
    cod: number;
}

const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

export function getDirection(deg: number) {
    // tslint:disable-next-line:binary-expression-operand-order
    const value = Math.floor(0.5 + (deg / 22.5));

    return directions[(value % 16)];
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

    // TODO: Re-Add the directions.
    return `${req.name} is expecting ${req.weather[0].description}, with wind speeds of ${req.wind.speed}mph.`;
}
