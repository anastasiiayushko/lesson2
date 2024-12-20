export type BlogSchemaType = {
    id: string
    name: string // max 15
    description: string // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    createdAt: string
    isMembership: boolean
}

export type BlogSchemaInputType = {
    name: string // max 15
    description: string // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    // createdAt: string
    // isMembership: boolean
}


export type PostSchemaType = {
    id: string // maxLength: 30
    title: string
    shortDescription: string, //maxLength: 100
    content: string, //maxLength: 1000
    blogId: string,
    blogName: string,
    createdAt: string,
}

export type PostSchemaInputType = {
    title: string
    shortDescription: string, //maxLength: 100
    content: string, //maxLength: 1000
    blogId: string,
    blogName: string
}
export type PostSchemaUpdateType = {
    title: string
    shortDescription: string, //maxLength: 100
    content: string, //maxLength: 1000
    blogId: string,
}