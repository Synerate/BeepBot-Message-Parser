import { IMessage } from './interface/message';
import { ISetting } from './interface/settings';

export const mockMessage: IMessage = {
    channel: {
        coreId: '',
        id: null,
        name: 'artdude543',
    },
    message: {
        args: ['Testing', 'the', 'parser!'],
        id: null,
        raw: 'Testing the parser!',
    },
    provider: {
        type: null,
    },
    user: {
        id: null,
        name: 'TestUser',
    },
};

export const mockSettings: ISetting = {
    channel: {
        locale: 'en_US',
        timezone: 'Europe/London',
    },
};
