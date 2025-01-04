import {BlogRepository} from "./dal/blogRepository";
import {BlogInputModelType, BlogViewModelType} from "../../types/input-output-types/blog-types";


export class BlogService {
    private _blogRepo = new BlogRepository()

    _mapperBodyBlog = (body: BlogInputModelType): BlogInputModelType => {
        return {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
        }
    }

    getById = async (id: string): Promise<BlogViewModelType | null> => {
        return await this._blogRepo.getById(id);
    }

    createBlog = async (body: BlogInputModelType): Promise<string> => {
        let createBlog = {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        return await this._blogRepo.createBlog(createBlog);

    }
    updateById = async (id: string,
                        body: Omit<BlogInputModelType, 'createdAt' | 'isMembership'>): Promise<boolean> => {
        let blogUpdate = this._mapperBodyBlog(body)
        return await this._blogRepo.updateById(id, blogUpdate);

    }

    deleteDyId = async (id: string): Promise<boolean> => {
        return await this._blogRepo.deleteDyId(id);

    }
}

