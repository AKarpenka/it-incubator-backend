import { ObjectId } from "mongodb";
import { TPaginationAndSorting } from "../../../core/types/sortingPagination";
import { CommentsSortBy } from "../constants";

export type TCommentstorInfo = {
    userId: ObjectId;
    userLogin: string;
}

export type TComment = {
    content: string;
    commentatorInfo: TCommentstorInfo;
    createdAt: string;
    postId: ObjectId;
}

export type TCommentsQueryInput = TPaginationAndSorting<CommentsSortBy>;
