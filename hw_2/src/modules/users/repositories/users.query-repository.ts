import { ObjectId, WithId } from "mongodb";
import { TUser, TUserQueryInput } from "../types/user";
import { usersCollection } from "../../../db/db";


export const usersQueryRepository = {
    getUsers: async (queryDto: TUserQueryInput): Promise<{ items: WithId<TUser>[]; totalCount: number }> => {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};

        if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: 'i' };
        }

        if (searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: 'i' };
        }

        const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;

        const items = await usersCollection
            .find(filter)
            .sort({ [sortBy]: sortDirectionValue })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCount = await usersCollection.countDocuments(filter);

        return {
            items,
            totalCount,
        }
    },

    checkFieldTaken: async (field: string): Promise<WithId<TUser> | null> => {
        return await usersCollection.findOne({ [field]: field })
    },

    getUserById: async (id: string | ObjectId): Promise<{ user: WithId<TUser> | null }> => ({
        user: await usersCollection.findOne({ _id: new ObjectId(id) })
    }),

    findByLoginOrEmail: async (loginOrEmail: string): Promise<WithId<TUser> | null> => {
        return await usersCollection.findOne({
          $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
        });
      },
}