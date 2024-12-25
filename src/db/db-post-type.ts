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