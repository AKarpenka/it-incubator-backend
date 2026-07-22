import { usersCollection } from "../../../db/db";
import { DeleteResult, ModifyResult, ObjectId, WithId } from "mongodb";
import { TUser } from "../types/user";
import { v4 as uuid } from "uuid";
import { add } from "date-fns";
import { injectable } from "inversify";

@injectable()
export class UsersRepository {
    async createUser (newUser: TUser): Promise<{ insertedId: ObjectId }> {
            return {
            insertedId: (await usersCollection.insertOne(newUser)).insertedId
        }
    }

    async deletedUser (id: string): Promise<DeleteResult> {
        return await usersCollection.deleteOne({_id: new ObjectId(id)})
    }

    async confirmUserByConfirmationCode (confirmationCode: string): Promise<{user: WithId<TUser> | null}> {
        const result = await usersCollection.findOneAndUpdate(
            { 'emailConfirmation.confirmationCode': confirmationCode },
            { $set: { 'emailConfirmation.isConfirmed': true } },
            { returnDocument: 'after' },
        );

        return { user: result };
    }

    async updateConfirmationCode (userId: ObjectId): Promise<{user: WithId<TUser> | null}> {
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
    }

    async updateRecoveryCode(userId: ObjectId): Promise<{user: WithId<TUser> | null}> {
        const result = await usersCollection.findOneAndUpdate(
            { _id: userId },
            { 
                $set: { 
                    passwordRecovery: {
                        recoveryCode: uuid(),
                        expirationDate: add(new Date(), { minutes: 1 })
                    }
                } 
            },
            { returnDocument: 'after' },
        );

        return { user: result };
    }


    async updateUserPassword(userId: ObjectId, newPassword: string): Promise<{user: WithId<TUser> | null}> {
        const result = await usersCollection.findOneAndUpdate(
            { _id: userId },
            { 
                $set: { 
                    password: newPassword
                } ,
                $unset: {
                    passwordRecovery: ""
                }
            },
            { returnDocument: 'after' },
        );

        return { user: result };
    }
}