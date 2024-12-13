export type BlogSchema = {
    id: string
    name: string // max 15
    description: string // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}

export type BlogSchemaInput = Omit<BlogSchema, 'id'>


export type PostSchema = {
    id: string // maxLength: 30
    title: string
    shortDescription: string, //maxLength: 100
    content: string, //maxLength: 1000
    blogId: string,
    blogName: string
}

export type PostSchemaInput = Omit<PostSchema, 'id'>