import 'jest';
import * as db from "../src/db/db";
import { TBlog, TPost } from "../src/types/TDataBase";
import { mockDB } from "./mocks";

const fakeCollection = <T extends { id: string }>(data: T[]) => ({
  find: () => ({
    toArray: async () => data,
  }),
  findOne: async (query: Partial<T>) => data.find((d) => d.id === query.id),
  insertOne: async (doc: T) => {
    data.push(doc);
    return { insertedId: doc.id };
  },
  updateOne: async (filter: Partial<T>, update: any) => {
    const idx = data.findIndex((d) => d.id === filter.id);

    if (idx === -1) {
      return { matchedCount: 0, modifiedCount: 0 };
    }

    data[idx] = { ...data[idx], ...update.$set };

    return { matchedCount: 1, modifiedCount: 1 };
  },
  findOneAndUpdate: async (
    filter: Partial<T>,
    update: any,
    options?: { returnDocument?: 'before' | 'after' }
  ) => {
    const idx = data.findIndex((d) => d.id === filter.id);

    if (idx === -1) {
      return null;
    }
  
    data[idx] = { ...data[idx], ...update.$set };
  
    return options?.returnDocument === 'after'
        ? data[idx]
        : { ...data[idx], ...Object.keys(update.$set).reduce((acc, key) => {
            acc[key] = (data[idx] as any)[key]; 
            return acc;
          }, {} as any) };
  },
  deleteOne: async (filter: Partial<T>) => {
    const idx = data.findIndex((d) => d.id === filter.id);

    if (idx === -1) {
      return { deletedCount: 0 };
    }

    data.splice(idx, 1);

    return { deletedCount: 1 };
  },
  deleteMany: async () => {
    data.length = 0;
    
    return { deletedCount: 1 };
  },
});

jest.spyOn(db, "getBlogsCollection").mockImplementation(() =>
  fakeCollection<TBlog>(mockDB.blogs) as any
);

jest.spyOn(db, "getPostsCollection").mockImplementation(() =>
  fakeCollection<TPost>(mockDB.posts) as any
);
