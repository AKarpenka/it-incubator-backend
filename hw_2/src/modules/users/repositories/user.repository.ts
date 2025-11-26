import { usersCollection } from "../../../db/db";
import { DeleteResult, ModifyResult, ObjectId, WithId } from "mongodb";
import { TUser } from "../types/user";
import { v4 as uuid } from "uuid";

export const usersRepository = {
    createUser: async (newUser: TUser): Promise<{ insertedId: ObjectId }> => ({
        insertedId: (await usersCollection.insertOne(newUser)).insertedId
    }),

    deletedUser: async (id: string): Promise<DeleteResult> => {
        return await usersCollection.deleteOne({_id: new ObjectId(id)})
    },

    confirmUserByConfirmationCode: async (confirmationCode: string): Promise<{user: WithId<TUser> | null}> => {
        const { value: user } = await usersCollection.findOneAndUpdate(
            { 'emailConfirmation.confirmationCode': confirmationCode },
            { $set: { 'emailConfirmation.isConfirmed': true } },
            { returnDocument: 'after' },
        ) as unknown as ModifyResult<TUser>;

        return { user };
    },

    updateConfirmationCode: async (email: string): Promise<{user: WithId<TUser> | null}> => {
        const { value: user } = await usersCollection.findOneAndUpdate(
            { email: email },
            { $set: { 'emailConfirmation.confirmationCode': uuid() } },
            { returnDocument: 'after' },
        ) as unknown as ModifyResult<TUser>;

        return { user };
    },
}