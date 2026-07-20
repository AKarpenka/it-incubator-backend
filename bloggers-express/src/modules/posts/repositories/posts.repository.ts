import { DeleteResult, ObjectId, WithId } from "mongodb";
import { postsCollection } from "../../../db/db";
import { TPost, TPostQueryInput } from "../types/post";
import { TPostDTO } from "../application/dto/posts-input.dto";

export class PostsRepository {
    async getPosts (
        queryDto: TPostQueryInput,
        blogId?: string,
    ): Promise<{ items: WithId<TPost>[]; totalCount: number }> {
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
    }

    async getPostById (id: string): Promise<WithId<TPost> | null> {
        return await postsCollection.findOne({ _id: new ObjectId(id) });
    }

    async createPost (newPost: TPost): Promise<WithId<TPost> | null> {
        const postWithoutMongoId = await postsCollection.insertOne(newPost);

        return {...newPost, _id: postWithoutMongoId.insertedId};
    }

    async updatePostById (id: string, post: TPostDTO): Promise<WithId<TPost> | null> {
        return await postsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { ...post } },
            { returnDocument: 'after' },
        );
    }

    async deletePostById (id: string): Promise<DeleteResult> {
        return await postsCollection.deleteOne({ _id: new ObjectId(id) });
    }
}