import { Parser } from './';

const instance = new Parser();

const message = {
    channel: {
        id: '123',
        name: 'test',
        coreId: '123',
        serviceId: '123',
    },
    provider: 'twitch',
    message: {
        args: ['d2', 'SPS'],
        raw: 'test',
    },
    user: {
        id: '36297622',
        name: 'artdude543',
        roles: ['test'],
    },
};

const setting = {
    timezone: 'America/New_York',
}

async function test() {
    // const INPUT = '{repeat {randomnum 1 10} 2} ; {repeat {randomnum 1 10} 2} ; {repeat {randomnum 1 10} 2}; {repeat {randomnum 1 10} 2}';
    // const INPUT = '{incr {repeat {randomnum 15 20} 5} {repeat {randomnum 15 20} 2}}';
    // const INPUT = '{repeat {repeat {randomnum 15 20} 5} 4}';
    // const INPUT = '{weather York,UK}'
    // const INPUT = 'Beep can MATH?! {math 10 degC to degF}';
    const INPUT = `{tweet SPSinBOS}`

    console.log('Input:', INPUT);
    const res = await instance.parse(message, setting, INPUT);
    console.log('Output:', res);
}

test();
