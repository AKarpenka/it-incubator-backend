"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const db = __importStar(require("../src/db/db"));
const mocks_1 = require("./mocks");
const mongodb_1 = require("mongodb");
const fakeCollection = (data) => ({
    find: (query, options) => ({
        toArray: () => __awaiter(void 0, void 0, void 0, function* () {
            const results = query && Object.keys(query).length > 0
                ? data.filter(d => Object.entries(query).every(([key, value]) => d[key] === value))
                : data;
            // Применяем projection, если он указан
            if ((options === null || options === void 0 ? void 0 : options.projection) && options.projection._id === 0) {
                return results.map(item => {
                    const _a = item, { _id } = _a, rest = __rest(_a, ["_id"]);
                    return rest;
                });
            }
            return results.map(item => (Object.assign(Object.assign({}, item), { _id: new mongodb_1.ObjectId(item.id) })));
        }),
    }),
    findOne: (query, options) => __awaiter(void 0, void 0, void 0, function* () {
        let result;
        if (query._id) {
            // Если передан ObjectId, преобразуем в строку для поиска по id в моках
            const idString = typeof query._id === 'object' && query._id.toString
                ? query._id.toString()
                : String(query._id);
            result = data.find((d) => d.id === idString);
        }
        else if (query.id) {
            result = data.find((d) => d.id === query.id);
        }
        else {
            result = null;
        }
        if (!result)
            return null;
        // Применяем projection, если он указан
        if ((options === null || options === void 0 ? void 0 : options.projection) && options.projection._id === 0) {
            const _a = result, { _id } = _a, rest = __rest(_a, ["_id"]);
            return rest;
        }
        return Object.assign(Object.assign({}, result), { _id: new mongodb_1.ObjectId(result.id) });
    }),
    insertOne: (doc) => __awaiter(void 0, void 0, void 0, function* () {
        // Эмулируем поведение MongoDB - мутируем документ, добавляя _id
        const docWithId = doc;
        if (!docWithId.createdAt) {
            docWithId.createdAt = new Date().toISOString();
        }
        if (docWithId.name !== undefined && docWithId.isMembership === undefined) {
            docWithId.isMembership = false;
        }
        if (!docWithId.id) {
            const newObjectId = new mongodb_1.ObjectId();
            docWithId.id = newObjectId.toString();
            docWithId._id = newObjectId;
        }
        else {
            docWithId._id = new mongodb_1.ObjectId(docWithId.id);
        }
        data.push(doc);
        return { insertedId: docWithId._id };
    }),
    updateOne: (filter, update) => __awaiter(void 0, void 0, void 0, function* () {
        let idx;
        if (filter._id) {
            const idString = typeof filter._id === 'object' && filter._id.toString
                ? filter._id.toString()
                : String(filter._id);
            idx = data.findIndex((d) => d.id === idString);
        }
        else {
            idx = data.findIndex((d) => d.id === filter.id);
        }
        if (idx === -1) {
            return { matchedCount: 0, modifiedCount: 0 };
        }
        data[idx] = Object.assign(Object.assign({}, data[idx]), update.$set);
        return { matchedCount: 1, modifiedCount: 1 };
    }),
    findOneAndUpdate: (filter, update, options) => __awaiter(void 0, void 0, void 0, function* () {
        let idx;
        if (filter._id) {
            const idString = typeof filter._id === 'object' && filter._id.toString
                ? filter._id.toString()
                : String(filter._id);
            idx = data.findIndex((d) => d.id === idString);
        }
        else {
            idx = data.findIndex((d) => d.id === filter.id);
        }
        if (idx === -1) {
            return null;
        }
        data[idx] = Object.assign(Object.assign({}, data[idx]), update.$set);
        const result = (options === null || options === void 0 ? void 0 : options.returnDocument) === 'after'
            ? data[idx]
            : Object.assign(Object.assign({}, data[idx]), Object.keys(update.$set).reduce((acc, key) => {
                acc[key] = data[idx][key];
                return acc;
            }, {}));
        // Применяем projection, если он указан
        if ((options === null || options === void 0 ? void 0 : options.projection) && options.projection._id === 0) {
            const _a = result, { _id } = _a, rest = __rest(_a, ["_id"]);
            return rest;
        }
        return Object.assign(Object.assign({}, result), { _id: new mongodb_1.ObjectId(result.id || data[idx].id) });
    }),
    deleteOne: (filter) => __awaiter(void 0, void 0, void 0, function* () {
        let idx;
        if (filter._id) {
            const idString = typeof filter._id === 'object' && filter._id.toString
                ? filter._id.toString()
                : String(filter._id);
            idx = data.findIndex((d) => d.id === idString);
        }
        else {
            idx = data.findIndex((d) => d.id === filter.id);
        }
        if (idx === -1) {
            return { deletedCount: 0 };
        }
        data.splice(idx, 1);
        return { deletedCount: 1 };
    }),
    deleteMany: () => __awaiter(void 0, void 0, void 0, function* () {
        data.length = 0;
        return { deletedCount: 1 };
    }),
});
// Мокифицируем коллекции напрямую через переопределение свойств
Object.defineProperty(db, "blogsCollection", {
    get: () => fakeCollection(mocks_1.mockDB.blogs),
    configurable: true,
});
Object.defineProperty(db, "postsCollection", {
    get: () => fakeCollection(mocks_1.mockDB.posts),
    configurable: true,
});
//# sourceMappingURL=setupTests.js.map