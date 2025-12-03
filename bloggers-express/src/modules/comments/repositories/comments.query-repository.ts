import {  ObjectId, WithId } from "mongodb";
import { TComment, TCommentsQueryInput } from "../types/comment";
import { commentsCollection } from "../../../db/db";

export const commentsQueryRepository = {
    getCommentById: async (id: string): Promise<{ comment: WithId<TComment> | null}> => {
        if (!ObjectId.isValid(id)) {
            return { comment: null };
        }
        
        return { comment: await commentsCollection.findOne({ _id: new ObjectId(id) }) };
    },

    getCommentsByPostId: async (
        queryDto: TCommentsQueryInput,
        postId: string,
    ): Promise<{ items: WithId<TComment>[]; totalCount: number } > => {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter = {
            postId: new ObjectId(postId)
        };

        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        const items = await commentsCollection
            .find(filter)
            .sort({ [sortBy]: sortDirectionValue })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await commentsCollection.countDocuments(filter);

        return { items, totalCount };
    },
};
