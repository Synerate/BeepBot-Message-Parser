import { Parser, ParserContext } from '../';
import { IMessage, ISetting } from '../interface';

interface VideoResponse {
    data: {
        cursor: number;
        has_more: boolean;
        videos: {
            id: string;
            title: string;
            create_time: number;
            share_url: string;
        }[];
    };
    error: {
        code: string;
        message: string;
        log_id: string;
    };
}

export async function tiktok(this: Parser, message: IMessage, _settings: ISetting, _context: ParserContext) {
    const res: VideoResponse = await this.middleware.onServiceAPI(
        'https://open.tiktokapis.com/v2/video/list/?fields=id,title,create_time,share_url',
        {
            coreId: message.channel.coreId,
            method: 'POST',
            serviceId: message.channel.serviceId,
            provider: 'tiktok',
            body: {
                max_count: 5,
            },
        },
    );
    if (res == null) {
        return '[Error: API Error]';
    }

    if (res.data == null || res.data.videos.length === 0) {
        return '[Error: No videos found]';
    }

    return `${res.data.videos[0].title} - ${res.data.videos[0].share_url}`;
}
