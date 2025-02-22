import {BlogRepository} from "./dal/blogRepository";
import {BlogInputModelType, BlogViewModelType} from "../../types/input-output-types/blog-types";


export class BlogService {
    constructor(private readonly blogRepository: BlogRepository) {}


    private _mapperBodyBlog(body: BlogInputModelType): BlogInputModelType {
        return {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
        }
    }

    async getById(id: string): Promise<BlogViewModelType | null> {
        return await this.blogRepository.getById(id);
    }

    async createBlog(body: BlogInputModelType): Promise<string> {
        let createBlog = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        return await this.blogRepository.createBlog(createBlog);

    }

    async updateById(id: string, body: Omit<BlogInputModelType, 'createdAt' | 'isMembership'>): Promise<boolean> {
        let blogUpdate = this._mapperBodyBlog(body)
        return await this.blogRepository.updateById(id, blogUpdate);

    }

    async deleteDyId(id: string): Promise<boolean> {
        return await this.blogRepository.deleteDyId(id);

    }
}

