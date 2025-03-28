import {injectable} from "inversify";
import {PostRepository} from "../../infrastructure/repositories/postRepository";
import {BlogRepository} from "../../../blog/dal/blogRepository";
import {StatusCode} from "../../../../types/status-code-types";
import {ServiceResponseType} from "../../../../types/service-response-type";

@injectable()
class DeletePostUseCase {
    constructor(
        protected postRepository: PostRepository,
        protected blogRepository: BlogRepository
    ) {
    }

    async execute(postId: string): Promise<ServiceResponseType<boolean>> {

        const result = await this.postRepository.deletePost(postId);
        if (!result) {
            return {
                status: StatusCode.NOT_FOUND_404,
                extensions: [],
                data: false

            }
        }


        return {
            status: StatusCode.NO_CONTENT_204,
            extensions: [],
            data: true
        }

    }
}

export default DeletePostUseCase;