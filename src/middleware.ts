import { IMessage } from './interface';
import { VarType } from './methods/variable';

interface IReqOpts {
    coreId?: string;
    method: string;
    serviceId?: string;
}

type MethodType = '';

export interface Middleware {
    /**
     * Request callback to ask the provider to send a request and send the data back for the parser to use.
     *
     * @returns Object/String data which is sent back from the relevant API service called. The method should then translate the data.
     */
    onServiceAPI?(uri: string, opts: IReqOpts): Promise<any>;

    /**
     * Request callback for a customapi parser. Which allows users to hit external data-suppliers to get information back.
     *
     * @returns Object/String data which is sent back from the relevant API service called. The method should then translate the data.
     */
    onExternalAPI?(uri: string, message: IMessage, pickOpts: string): Promise<any>;

    /**
     * Variable callback to process any change(s).
     */
    onVariableAPI?(coreId: string, varName: string, type: VarType, val: string, reset: boolean): Promise<number>;

    /**
     * Handle a method call which may need to access other API services or database access. This is generic and can be used for any supported method.
     */
    onHandleMethod?(type: MethodType, message: IMessage, args: string): Promise<string>;
}
