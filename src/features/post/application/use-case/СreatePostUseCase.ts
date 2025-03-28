import {injectable} from "inversify";
import {PostRepository} from "../../infrastructure/repositories/postRepository";
import {BlogRepository} from "../../../blog/dal/blogRepository";
import {PostModel} from "../../domain/postSchema";
import {PostCreateDto} from "../dto/PostCreateDto";
import {PostMapper} from "../mapper/PostMapper";
import {ServiceResponseType} from "../../../../types/service-response-type";
import {StatusCode} from "../../../../types/status-code-types";

@injectable()
class CreatePostUseCase {
    constructor(
        protected postRepository: PostRepository,
        protected blogRepository: BlogRepository
    ) {
    }

    async execute(postInput: PostCreateDto): Promise<ServiceResponseType<{id: string} | null>> {

        const blog = await this.blogRepository.getById(postInput.blogId);
        if (!blog) {
            return {
                status: StatusCode.NOT_FOUND_404,
                extensions: [],
                data: null
            };
        }
        const newPost = PostMapper.toEntity(new PostCreateDto(postInput), blog.name)

        const post = PostModel.makeInstance(newPost)
        const result = await this.postRepository.save(post);
        return {
            status: StatusCode.CREATED_201,
            extensions: [],
            data: {id: result._id.toString()},
        };

    }
}

export default CreatePostUseCase;