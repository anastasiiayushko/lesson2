export type CommentViewModelType = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfoViewType,
    createdAt: string,
}


export type CommentatorInfoViewType = {
    userId: string,
    userLogin: string,
}