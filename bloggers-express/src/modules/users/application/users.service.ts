import { DeleteResult, ObjectId, WithId } from "mongodb";
import { TUser } from "../types/user";
import { TUserDTO } from "../repositories/dto/users-input.dto";
import { UsersQueryRepository } from "../repositories/users.query-repository";
import { UsersRepository } from "../repositories/user.repository";
import { Argon2Service } from "../../../core/adapters/argon2.service";
import { v4 as uuid } from 'uuid';
import { add } from "date-fns";
import { inject, injectable } from "inversify";

@injectable()
export class UsersService {
    constructor(
        @inject(Argon2Service) protected argon2Service: Argon2Service,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(UsersQueryRepository) protected usersQueryRepository: UsersQueryRepository,
    ) {}

    async createUser (inputUser: TUserDTO, isConfirmed?: boolean): Promise<{ user: WithId<TUser> | null }> {
        const passwordHash = await this.argon2Service.generateHash(inputUser.password);

        const newUser: TUser = {
            login: inputUser.login,
            email: inputUser.email,
            password: passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuid(),
                expirationDate: add(new Date(), {
                    minutes: 1
                }),
                isConfirmed: isConfirmed ?? false,
            }
        };

        const { insertedId } = await this.usersRepository.createUser(newUser);

        return await this.usersQueryRepository.getUserById(insertedId);
    }

    async deleteUser(id: string): Promise<string | null> {
        if(!ObjectId.isValid(id)) {
            return Promise.resolve(null);
        }

        const deletedBlog = await this.usersRepository.deletedUser(id);

        if (deletedBlog.deletedCount < 1) {
            return null;
        };

        return id;
    }
}