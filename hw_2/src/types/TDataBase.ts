export type TBlog = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}

export type TDataBase = {
    blogs: TBlog[],
    posts: any,
}