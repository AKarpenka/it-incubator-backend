import { DeleteResult, ObjectId, WithId } from "mongodb";
import { TComment } from "../types/comment";
import { commentsCollection } from "../../../db/db";
import { TCommentDTO } from "../dto/comment.dto";
import { injectable } from "inversify";

@injectable()
export class CommentsRepository {
    async createComment (newComment: TComment): Promise<{comment: WithId<TComment>}> {
        const createdComment = await commentsCollection.insertOne(newComment);

        return {
            comment: {
                ...newComment, 
                _id: createdComment.insertedId 
            }
        };
    }

    async updateCommentById (id: string, comment: TCommentDTO): Promise<{comment: WithId<TComment> | null}> {
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
    }

    async deleteCommentById (id: string): Promise<DeleteResult> {
        return await commentsCollection.deleteOne({ _id: new ObjectId(id) });
    }
}