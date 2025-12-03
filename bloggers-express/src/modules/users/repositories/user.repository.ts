import { usersCollection } from "../../../db/db";
import { DeleteResult, ModifyResult, ObjectId, WithId } from "mongodb";
import { TUser } from "../types/user";
import { v4 as uuid } from "uuid";
import { add } from "date-fns";

export const usersRepository = {
    createUser: async (newUser: TUser): Promise<{ insertedId: ObjectId }> => ({
        insertedId: (await usersCollection.insertOne(newUser)).insertedId
    }),

    deletedUser: async (id: string): Promise<DeleteResult> => {
        return await usersCollection.deleteOne({_id: new ObjectId(id)})
    },

    confirmUserByConfirmationCode: async (confirmationCode: string): Promise<{user: WithId<TUser> | null}> => {
        const result = await usersCollection.findOneAndUpdate(
            { 'emailConfirmation.confirmationCode': confirmationCode },
            { $set: { 'emailConfirmation.isConfirmed': true } },
            { returnDocument: 'after' },
        );

        return { user: result };
    },

    updateConfirmationCode: async (userId: ObjectId): Promise<{user: WithId<TUser> | null}> => {
        const result = await usersCollection.findOneAndUpdate(
            { _id: userId },
            { 
                $set: { 
                    'emailConfirmation.confirmationCode': uuid(),
                    'emailConfirmation.expirationDate': add(new Date(), { minutes: 1 })
                } 
            },
            { returnDocument: 'after' },
        );

        return { user: result };
    },
}