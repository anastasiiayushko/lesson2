export class PostCreateDto {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;

    constructor(data: any) {
        if (!data.title || !data.shortDescription || !data.content || !data.blogId) {
            throw new Error("Missing required fields");
        }
        this.title = data.title;
        this.shortDescription = data.shortDescription;
        this.content = data.content;
        this.blogId = data.blogId;
    }
}