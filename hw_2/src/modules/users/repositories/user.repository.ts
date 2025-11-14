import { usersCollection } from "../../../db/db";
import { DeleteResult, ObjectId } from "mongodb";
import { TUser } from "../types/user";

export const usersRepository = {
    createUser: async (newUser: TUser): Promise<{ insertedId: ObjectId }> => ({
        insertedId: (await usersCollection.insertOne(newUser)).insertedId
    }),

    deletedUser: async (id: string): Promise<DeleteResult> => {
        return await usersCollection.deleteOne({_id: new ObjectId(id)})
    }
}