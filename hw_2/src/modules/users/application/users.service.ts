import { DeleteResult, ObjectId, WithId } from "mongodb";
import { TUser } from "../types/user";
import { TUserDTO } from "../repositories/dto/users-input.dto";
import { usersQueryRepository } from "../repositories/users.query-repository";
import { usersRepository } from "../repositories/user.repository";
import { argon2Service } from "../../auth/application/argon2.service";

export const usersService = {
    createUser: async (inputUser: TUserDTO): Promise<{ user: WithId<TUser> | null }> => {
        const passwordHash = await argon2Service.generateHash(inputUser.password);

        const newUser: TUser = {
            login: inputUser.login,
            email: inputUser.email,
            password: passwordHash,
            createdAt: new Date().toISOString(),
        };

        const { insertedId } = await usersRepository.createUser(newUser);

        return await usersQueryRepository.getUserById(insertedId);
    },

    deleteUser: async (id: string): Promise<string | null> => {
        if(!ObjectId.isValid(id)) {
            return Promise.resolve(null);
        }

        const deletedBlog = await usersRepository.deletedUser(id);

        if (deletedBlog.deletedCount < 1) {
            return null;
        };

        return id;
    },
}