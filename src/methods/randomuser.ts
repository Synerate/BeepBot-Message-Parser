import { chain } from 'lodash';

import { Parser, ParserContext } from '../';
import { IMessage, ISetting } from '../interface';

export async function randomuser(this: Parser, message: IMessage, _settings: ISetting, _context: ParserContext): Promise<string> {
    if (message.provider === 'discord') {
        return '<randomuser>';
    }

    const users: string[] = await this.middleware.onHandleMethod('getUsers', message);
    if (users != null && users.length > 0) {
        return chain(users)
            .shuffle().shuffle().shuffle()
            .sample()
            .valueOf();
    }

    return '[Error: Failed to get users]';
}
