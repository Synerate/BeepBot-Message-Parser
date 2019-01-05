export interface IMessage {
    channel: {
        id: string | number;
        name: string;
        /**
         * Core Id used as a unique name for backend processing.
         *
         * I.E. So we know what channel a var belongs too w/o having to convert the provider Id to the backend Id.
         */
        coreId?: string;
    };
    /**
     * The provider when the message came from. I.E. Mixer/Twitch etc...
     */
    provider: string;
    message: {
        /**
         * The raw message but split on spaces.
         */
        args: string[];
        raw: string;
    };
    user: {
        id: string | number;
        name: string;
    };
}

export interface ISetting {
    /**
     * The TimeZone to use as default when using the {time} parser.
     *
     * Valid: https://momentjs.com/timezone/
     */
    timezone: string;
}
