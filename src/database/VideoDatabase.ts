import { TVideos } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class VideoDatabase extends BaseDatabase {
    public static TABLE_VIDEOS = "videos"

    public async getVideos():Promise<TVideos[]> {
        const videosDB: TVideos[] = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS)

        return videosDB
    }

    public async getVideoById(id: string):Promise<TVideos | undefined> {
        const [videoDB]: TVideos[] | undefined[] = await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).where({id})

        return videoDB
    }

    public async insertVideo(newVideoDB: TVideos):Promise<void> {
        await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).insert(newVideoDB)

    }

    public async updateVideo(newVideoDB: TVideos, id: string):Promise<void> {
        await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).update(newVideoDB).where({id})
        
    }

    public async deleteVideo(newVideoDB: any, id: string):Promise<void> {
        await BaseDatabase.connection(VideoDatabase.TABLE_VIDEOS).delete(newVideoDB).where({id})
        
    }

    
}
