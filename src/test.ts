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
    // const INPUT = 'Beep can MATH?! {math 10c to f}';
    // const INPUT = `{evalcode "async function getText() { const req = await urlfetch('https://api.chucknorris.io/jokes/random'); return req.value; } getText();"}`;
    // const INPUT = '{currencyadjust -{randomnum 1 25}} {user} you got attacked by Randal The Vandal and lost {ctx 0} {currencyname {ctx 0}}';
    // const INPUT = `{urlfetch "https://api.synerate.com/beepbot/v2/channels/{user}"}`;
    // const INPUT = `{randlist "Cheese Cakes; Melons"}`;
    const INPUT = `{urlfetchctx {compile "https://api.synerate.com/beepbot/v2/channels/{user}"}} {ctx 0 name} {ctx 0 user.id} {ctx 0 user.grants[0].provider}`;
    // const INPUT = `{currencyadjust {randomnum 15 20}} {user}'s fireteam took down Nezarec! After not getting the Exotic for the {randomnum 5 100}th time now, you gain {ctx 0} {currencyname {ctx 0}}`;

    console.log('Input:', INPUT);
    const res = await instance.parse(message, setting, INPUT);
    console.log('Output:', res);
}

test();
