export interface IMessage {
    channel: {
        id: string | number;
        coreId: string;
        name: string;
    };
    provider: {
        type: string;
    };
    message: {
        args: string[];
        id: string;
        raw: string;
    };
    user: {
        id: string | number;
        name: string;
    };
}
