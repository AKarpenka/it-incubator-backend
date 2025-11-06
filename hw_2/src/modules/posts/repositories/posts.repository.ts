import { DeleteResult, ObjectId, WithId } from "mongodb";
import { postsCollection } from "../../../db/db";
import { TPost, TPostQueryInput } from "../types/post";
import { TPostDTO } from "../application/dto/posts-input.dto";

export const postsRepository = {
    getPosts: async (
        queryDto: TPostQueryInput,
        blogId?: string,
    ): Promise<{ items: WithId<TPost>[]; totalCount: number }> => {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if(blogId) {
            filter.blogId = blogId;
        }

        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        const items = await postsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirectionValue })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await postsCollection.countDocuments(filter);

        return { items, totalCount };
    },

    getPostById: async (id: string): Promise<WithId<TPost> | null> => {
        return await postsCollection.findOne({ _id: new ObjectId(id) });
    },

    createPost: async (newPost: TPost): Promise<WithId<TPost> | null> => {
        const postWithoutMongoId = await postsCollection.insertOne(newPost);

        return {...newPost, _id: postWithoutMongoId.insertedId};
    },

    updatePostById: async (id: string, post: TPostDTO): Promise<WithId<TPost> | null> => {
        return await postsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { ...post } },
            { returnDocument: 'after' },
        );
    },

    deletePostById: async (id: string): Promise<DeleteResult> => {
        return await postsCollection.deleteOne({ _id: new ObjectId(id) });
    }
}