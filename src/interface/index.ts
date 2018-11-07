export interface IMessage {
    channel: {
        id: string | number;
        name: string;
        /**
         * This Id is used for ExoZone Development for usage with this module and BeepBot. This is only required when using the
         * {exoapi} parser otherwise it can be safely ignored.
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
