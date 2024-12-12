export type BlogSchema = {
    id: string
    name: string // max 15
    description: string // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}

export type BlogSchemaInput = Omit<BlogSchema, 'id'>
export type PostSchema = {
    id: string
    title: string
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}