import { TPaginationAndSorting } from "../../../core/types/sortingPagination";
import { UsersSortBy } from "../constants";

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
}

export type TUserQueryInput = TPaginationAndSorting<UsersSortBy> & {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
};;