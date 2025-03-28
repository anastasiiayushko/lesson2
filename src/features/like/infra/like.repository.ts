import {injectable} from "inversify";
import {LikeDocument,  LikeModel} from "../domain/like.entity";

@injectable()
export class LikeRepository {
    async findById(id: string): Promise<LikeDocument | null> {
        return await LikeModel.findById(id);
    }

    async save(like: LikeDocument) {
        return await like.save();
    }

}