import 'jest';
import * as db from "../src/db/db";
import { mockDB, TDataBase } from "./mocks";
import { ObjectId } from 'mongodb';

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
      
      return results.map(item => ({ ...item, _id: new ObjectId((item as any).id) }));
    },
  }),
  findOne: async (query: any, options?: { projection?: any }) => {
    let result;
    
    if (query._id) {
      // Если передан ObjectId, преобразуем в строку для поиска по id в моках
      const idString = typeof query._id === 'object' && query._id.toString 
        ? query._id.toString() 
        : String(query._id);
      result = data.find((d) => d.id === idString);
    } else if (query.id) {
      result = data.find((d) => d.id === query.id);
    } else {
      result = null;
    }
    
    if (!result) return null;
    
    // Применяем projection, если он указан
    if (options?.projection && options.projection._id === 0) {
      const { _id, ...rest } = result as any;
      return rest as T;
    }
    
    return { ...result, _id: new ObjectId(result.id) } as any;
  },
  insertOne: async (doc: T) => {
    // Эмулируем поведение MongoDB - мутируем документ, добавляя _id
    const docWithId = doc as any;
    
    if (!docWithId.createdAt) {
      docWithId.createdAt = new Date().toISOString();
    }
    
    if (docWithId.name !== undefined && docWithId.isMembership === undefined) {
      docWithId.isMembership = false;
    }
    
    if (!docWithId.id) {
      const newObjectId = new ObjectId();
      docWithId.id = newObjectId.toString();
      docWithId._id = newObjectId;
    } else {
      docWithId._id = new ObjectId(docWithId.id);
    }
    data.push(doc);
    return { insertedId: docWithId._id };
  },
  updateOne: async (filter: any, update: any) => {
    let idx;
    
    if (filter._id) {
      const idString = typeof filter._id === 'object' && filter._id.toString 
        ? filter._id.toString() 
        : String(filter._id);
      idx = data.findIndex((d) => d.id === idString);
    } else {
      idx = data.findIndex((d) => d.id === filter.id);
    }

    if (idx === -1) {
      return { matchedCount: 0, modifiedCount: 0 };
    }

    data[idx] = { ...data[idx], ...update.$set };

    return { matchedCount: 1, modifiedCount: 1 };
  },
  findOneAndUpdate: async (
    filter: any,
    update: any,
    options?: { returnDocument?: 'before' | 'after'; projection?: any }
  ) => {
    let idx;
    
    if (filter._id) {
      const idString = typeof filter._id === 'object' && filter._id.toString 
        ? filter._id.toString() 
        : String(filter._id);
      idx = data.findIndex((d) => d.id === idString);
    } else {
      idx = data.findIndex((d) => d.id === filter.id);
    }

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
    
    return { ...result, _id: new ObjectId((result as any).id || (data[idx] as any).id) } as any;
  },
  deleteOne: async (filter: any) => {
    let idx;
    
    if (filter._id) {
      const idString = typeof filter._id === 'object' && filter._id.toString 
        ? filter._id.toString() 
        : String(filter._id);
      idx = data.findIndex((d) => d.id === idString);
    } else {
      idx = data.findIndex((d) => d.id === filter.id);
    }

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

// Мокифицируем коллекции напрямую через переопределение свойств
Object.defineProperty(db, "blogsCollection", {
  get: () => fakeCollection<TDataBase['blogs'][0]>(mockDB.blogs) as any,
  configurable: true,
});

Object.defineProperty(db, "postsCollection", {
  get: () => fakeCollection<TDataBase['posts'][0]>(mockDB.posts) as any,
  configurable: true,
});
