import {injectable} from "inversify";
import {PostRepository} from "../../infrastructure/repositories/postRepository";
import {BlogRepository} from "../../../blog/dal/blogRepository";
import {PostInputModel} from "../../../../types/input-output-types/post-types";
import {StatusCode} from "../../../../types/status-code-types";
import {ServiceResponseType} from "../../../../types/service-response-type";
import {PostMapper} from "../mapper/PostMapper";

@injectable()
class UpdatePostUseCase {
    constructor(
        protected postRepository: PostRepository,
        protected blogRepository: BlogRepository
    ) {
    }

    async execute(postId: string, postInput: PostInputModel): Promise<ServiceResponseType<null>> {
        const blog = await this.blogRepository.getById(postInput.blogId);
        if (!blog) {
            return {
                status: StatusCode.NOT_FOUND_404,
                extensions: [],
                data: null

            }
        }

        const smartPost = await this.postRepository.findById(postId);
        if (!smartPost) {
            return {
                status: StatusCode.NOT_FOUND_404,
                extensions: [],
                data: null
            }
        }

        const postDto = PostMapper.toEntity(postInput, blog.name)
        smartPost.updatePost(postDto)

        await this.postRepository.save(smartPost);
        return {
            status: StatusCode.NO_CONTENT_204,
            data: null,
            extensions: [],
        }


    }
}

export default UpdatePostUseCase;