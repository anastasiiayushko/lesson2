import {generateDbId} from "../../db/generateDbId";
import {BlogRepository} from "./blogRepository";
import {BlogInputModelType, BlogViewModelType} from "../../types/input-output-types/blog-types";


export class BlogService {
    private _blogRepo = new BlogRepository()

    constructor() {
    }


    getAll = async (): Promise<BlogViewModelType[]> => {
        return await this._blogRepo.getAll();
    }
    getById = async (id: string): Promise<BlogViewModelType | null> => {
        return  await this._blogRepo.getById(id);
    }

    createBlog = async (blogData: BlogInputModelType): Promise<BlogViewModelType> => {
        let id: string = generateDbId();
        let createBlog = {
            ...blogData,
            id: id,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        return await this._blogRepo.createBlog(createBlog);

    }
    updateById = async (id: string,
                        blogUpdate: Omit<BlogInputModelType, 'createdAt' | 'isMembership'>): Promise<boolean> => {

       return await this._blogRepo.updateById(id, blogUpdate);

    }

    deleteDyId = async (id: string): Promise<boolean> => {
        return await this._blogRepo.deleteDyId(id);

    }
}

