import {generateDbId} from "../../db/generateDbId";
import {BlogRepository} from "./blogRepository";
import {BlogInputModelType, BlogViewModelType} from "../../types/input-output-types/blog-types";
import {BlogQueryInputType, BlogSchemaType} from "../../db/db-blog-type";
import {PaginationViewModelType} from "../../db/db-types";
import {BlogQueryRepository} from "./blogQueryRepository";


export class BlogService {
    private _blogRepo = new BlogRepository()
    private _blogQueryRepo = new BlogQueryRepository()

    _mapperBodyBlog = (body: BlogInputModelType): BlogInputModelType => {
        return {
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl,
        }
    }
    _utilBlogQuery = (query: BlogQueryInputType): BlogQueryInputType => {
        return {
            pageNumber: query?.pageNumber ?? 1,
            pageSize: query?.pageSize ?? 10,
            sortBy: query?.sortBy ?? 'createdAt',
            sortDirection: query?.sortDirection ?? 'desc',
            searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,

        }
    }

    getBlogsQuery = async (query: BlogQueryInputType)
        : Promise<PaginationViewModelType<BlogViewModelType>> => {
        let payload = this._utilBlogQuery(query);
        return await this._blogQueryRepo.getBlogsQuery(payload)
    }

    getAll = async (): Promise<BlogViewModelType[]> => {
        return await this._blogRepo.getAll();
    }
    getById = async (id: string): Promise<BlogViewModelType | null> => {
        return await this._blogRepo.getById(id);
    }

    createBlog = async (body: BlogInputModelType): Promise<BlogViewModelType> => {
        let id: string = generateDbId();
        let bodyBlog = this._mapperBodyBlog(body)
        let createBlog = {
            ...bodyBlog,
            id: id,
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

