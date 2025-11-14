import { WithId } from 'mongodb';
import { TUser } from '../../types/user';
import { TUserViewModel, TUserViewModelPaginated } from '../../types/user-view-model';

type TMetaParams = {
  pageNumber: number,
  pageSize: number,
  totalCount: number,
}

export function mapToUsersViewModelPaginated(
    users: WithId<TUser>[], 
    meta: TMetaParams,
  ): TUserViewModelPaginated {
  return {
    pagesCount:	Math.ceil(meta.totalCount / meta.pageSize),
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: users.map(
      (user): TUserViewModel => ({
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    })),
  }
}
