"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createString = exports.setMockDB = void 0;
const mocks_1 = require("./mocks");
const setMockDB = (dataset) => {
    var _a, _b;
    if (!dataset) {
        mocks_1.mockDB.blogs = [];
        mocks_1.mockDB.posts = [];
        return;
    }
    mocks_1.mockDB.blogs =
        ((_a = dataset.blogs) === null || _a === void 0 ? void 0 : _a.map((b) => {
            var _a;
            return (Object.assign(Object.assign({}, b), { createdAt: b.createdAt || new Date().toISOString(), isMembership: (_a = b.isMembership) !== null && _a !== void 0 ? _a : false }));
        })) || mocks_1.mockDB.blogs;
    mocks_1.mockDB.posts =
        ((_b = dataset.posts) === null || _b === void 0 ? void 0 : _b.map((p) => (Object.assign(Object.assign({}, p), { createdAt: p.createdAt || new Date().toISOString() })))) || mocks_1.mockDB.posts;
};
exports.setMockDB = setMockDB;
const createString = (length) => {
    let s = '';
    for (let x = 1; x <= length; x++) {
        s += x % 10;
    }
    return s;
};
exports.createString = createString;
//# sourceMappingURL=helpers.js.map