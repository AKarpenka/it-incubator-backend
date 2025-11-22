import { WithId } from "mongodb";
import { TUser } from "../../../../modules/users/types/user";
import { TCurrentUserViewModel } from "../../types/current-user-view-model";

export function mapToCurrentUserViewModel(user: WithId<TUser>): TCurrentUserViewModel {
    return {
        userId: user._id.toString(),
        login: user.login,
        email: user.email,
    }
}