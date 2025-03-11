import {injectable} from "inversify";
import {LikeDocument} from "../domain/like.entity";

@injectable()
export class LikeRepository {
    async save(like: LikeDocument){
        return await like.save();
    }

}