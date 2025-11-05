"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDb = clearDb;
const supertest_1 = __importDefault(require("supertest"));
const settings_1 = require("../../src/core/settings/settings");
const httpStatuses_1 = require("../../src/core/types/httpStatuses");
function clearDb(app) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app)
            .delete(`${settings_1.SETTINGS.PATH.TESTING}/all-data`)
            .expect(httpStatuses_1.HttpStatus.NoContent);
        return;
    });
}
//# sourceMappingURL=clear-db.js.map