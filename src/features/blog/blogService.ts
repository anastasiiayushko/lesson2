import {BlogRepository} from "./dal/blogRepository";
import {BlogInputModelType, BlogViewModelType} from "../../types/input-output-types/blog-types";
import {injectable} from "inversify";
import {BlogModel, DtoCreateBlogType} from "./domain/blog.entity";

@injectable()
export class BlogService {
    constructor(private readonly blogRepository: BlogRepository) {
    }


    static transformBodyBlog(body: BlogInputModelType): BlogInputModelType {
        return {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
        }
    }

    async getById(id: string): Promise<BlogViewModelType | null> {
        return await this.blogRepository.getById(id);
    }

    async createBlog(body: DtoCreateBlogType): Promise<string> {

        const dto = BlogService.transformBodyBlog(body);
        const blog = await BlogModel.createBlog(dto)
        return blog._id.toString()

    }

    async updateById(id: string, body: BlogInputModelType): Promise<boolean> {

        return await this.blogRepository.updateById(id, BlogService.transformBodyBlog(body));

    }

    async deleteDyId(id: string): Promise<boolean> {
        return await this.blogRepository.deleteDyId(id);

    }
}

