import {PostCreateDto} from "../dto/PostCreateDto";

export class PostMapper {
    static toEntity(dto: PostCreateDto, blogName: string) {
        return {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blogName,  // Теперь добавляется сразу здесь
        };
    }

    // static toDto(post: any): PostResponseDto {
    //     return new PostResponseDto(post);
    // }
}