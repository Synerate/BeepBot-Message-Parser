
import { randomUUID } from 'crypto';
import { VM, VMScript } from 'vm2';

import { IMessage, ISetting } from '../interface';

export async function evalcode(message: IMessage, _settings: ISetting, _request: typeof fetch, userCode: string) {
    const nodeVM = new VM({
        eval: false,
        timeout: 10000, // 10 seconds
        sandbox: {
            urlfetch: (uri: string) => {
                return;
            },
        },
    });

    try {
        const toRun = new VMScript(userCode, { filename: `${message.channel.name}-${randomUUID()}`});
        console.log(toRun.code);

        return nodeVM.run(toRun);
    } catch (err) {
        console.log(err);

        return '[Error: Invalid code]';
    }
}
