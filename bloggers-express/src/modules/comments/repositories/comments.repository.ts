import { DeleteResult, ObjectId, WithId } from "mongodb";
import { TComment } from "../types/comment";
import { commentsCollection } from "../../../db/db";
import { TCommentDTO } from "../dto/comment.dto";

export const commentsRepository = {
    createComment: async (newComment: TComment): Promise<{comment: WithId<TComment>}> => {
        const createdComment = await commentsCollection.insertOne(newComment);

        return {
            comment: {
                ...newComment, 
                _id: createdComment.insertedId 
            }
        };
    },

    updateCommentById: async (id: string, comment: TCommentDTO): Promise<{comment: WithId<TComment> | null}> => {
        if (!ObjectId.isValid(id)) {
            return { comment: null };
        }

        return {
            comment: await commentsCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { ...comment } },
                { returnDocument: 'after' },
            )
        }
    },

    deleteCommentById: async (id: string): Promise<DeleteResult> => {
        return await commentsCollection.deleteOne({ _id: new ObjectId(id) });
    },
}