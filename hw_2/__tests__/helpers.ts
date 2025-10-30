import { mockDB, TDataBase } from "./mocks";

export type ReadonlyDBType = {
  blogs: Readonly<TDataBase['blogs']>;
  posts: Readonly<TDataBase['posts']>;
};

export const setMockDB = (dataset?: Partial<ReadonlyDBType>) => {
  if (!dataset) {
    mockDB.blogs = [];
    mockDB.posts = [];
    
    return;
  }

  mockDB.blogs =
    dataset.blogs?.map((b) => ({
      ...b,
      createdAt: b.createdAt || new Date().toISOString(),
      isMembership: b.isMembership ?? false,
    })) || mockDB.blogs;

  mockDB.posts =
    dataset.posts?.map((p) => ({
      ...p,
      createdAt: p.createdAt || new Date().toISOString(),
    })) || mockDB.posts;
};

export const createString = (length: number) => {
  let s = '';

  for (let x = 1; x <= length; x++) {
    s += x % 10;
  }

  return s;
};
