import 'jest';
import * as db from "../src/db/db";
import { TBlog, TPost } from "../src/types/TDataBase";
import { mockDB } from "./mocks";

const fakeCollection = <T extends { id: string }>(data: T[]) => ({
  find: (query: Partial<T>, options?: { projection?: any }) => ({
    toArray: async () => {
      const results = query && Object.keys(query).length > 0 
        ? data.filter(d => Object.entries(query).every(([key, value]) => (d as any)[key] === value))
        : data;
      
      // Применяем projection, если он указан
      if (options?.projection && options.projection._id === 0) {
        return results.map(item => {
          const { _id, ...rest } = item as any;
          return rest;
        });
      }
      
      return results;
    },
  }),
  findOne: async (query: Partial<T>, options?: { projection?: any }) => {
    const result = data.find((d) => d.id === query.id);
    
    if (!result) return null;
    
    // Применяем projection, если он указан
    if (options?.projection && options.projection._id === 0) {
      const { _id, ...rest } = result as any;
      return rest as T;
    }
    
    return result;
  },
  insertOne: async (doc: T) => {
    // Эмулируем поведение MongoDB - мутируем документ, добавляя _id
    // (как делает настоящая MongoDB), но в массив data он попадет через destructuring в repository
    const docWithId = doc as any;
    docWithId._id = `generated-mongo-id-${Date.now()}-${Math.random()}`;
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
    options?: { returnDocument?: 'before' | 'after'; projection?: any }
  ) => {
    const idx = data.findIndex((d) => d.id === filter.id);

    if (idx === -1) {
      return null;
    }
  
    data[idx] = { ...data[idx], ...update.$set };
  
    const result = options?.returnDocument === 'after'
        ? data[idx]
        : { ...data[idx], ...Object.keys(update.$set).reduce((acc, key) => {
            acc[key] = (data[idx] as any)[key]; 
            return acc;
          }, {} as any) };
    
    // Применяем projection, если он указан
    if (options?.projection && options.projection._id === 0) {
      const { _id, ...rest } = result as any;
      return rest as T;
    }
    
    return result;
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
