import { WithId } from 'mongodb';
import { TUser } from '../../types/user';
import { TUserViewModel } from '../../types/user-view-model';

export function mapToUsersViewModel(user: WithId<TUser>): TUserViewModel {
  return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
  }
}
