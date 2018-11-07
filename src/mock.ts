import { IMessage, ISetting } from './interface';

export const mockMessage: IMessage = {
    channel: {
        coreId: '',
        id: null,
        name: 'artdude543',
    },
    message: {
        args: ['Testing', 'the', 'parser!'],
        raw: 'Testing the parser!',
    },
    provider: null,
    user: {
        id: null,
        name: 'TestUser',
    },
};

export const mockSettings: ISetting = {
    timezone: 'Europe/London',
};
