import LikeStatusPostUseCase from "../../src/features/post/application/use-case/LikeStatusPostUseCase";
import {container} from "../../src/inversify.config";
import {LikeStatusEnum} from "../../src/features/like/domain/like.entity";
import DataBaseMongoose from "../../src/db/DataBaseMongoose";
import {SETTINGS} from "../../src/settings";
import {PostQueryRepository} from "../../src/features/post/infrastructure/repositories/postQueryRepository";
import {LikeQueryRepository} from "../../src/features/like/infra/like.query.repository";


describe("set like status for post", () => {
    const dbMongoose = new DataBaseMongoose();
    const likeStatusUseCase = container.resolve(LikeStatusPostUseCase)
    const postQueryRepository = container.resolve(PostQueryRepository);
    const likeQueryRepository = container.resolve(LikeQueryRepository);
    beforeAll(async () => {

        await dbMongoose.connect(SETTINGS.MONGO_URL, SETTINGS.DATABASE_NAME)
    })
    afterAll(async () => {

        await dbMongoose.disconnect()
    });

    it("set status for post. should be return status like", async () => {
        const postId = "67e1930e0ec170039ca87b7e";
        const userId = "67e68ef809aa386a54ce1e38"


        const result = await  likeStatusUseCase.execute(postId, userId, LikeStatusEnum.Like);

        const post = await postQueryRepository.getById(postId);
        console.log(post);
        console.log(result);
    })
})