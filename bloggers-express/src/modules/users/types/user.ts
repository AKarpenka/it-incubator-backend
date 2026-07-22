import { TPaginationAndSorting } from "../../../core/types/sortingPagination";
import { UsersSortBy } from "../constants";

type TPasswordRecovery = {
    recoveryCode: string;
    expirationDate: Date,
}

export type TUser = {
    login: string;
    email: string;
    password: string;
    createdAt: string;
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
    passwordRecovery?: TPasswordRecovery;
}

export type TUserQueryInput = TPaginationAndSorting<UsersSortBy> & {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
};;