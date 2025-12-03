"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminAuthToken = generateAdminAuthToken;
const settings_1 = require("../../src/core/settings/settings");
const basic_auth_middleware_1 = require("../../src/middlewares/auth/basic-auth-middleware");
function generateAdminAuthToken() {
    const codedAuth = (0, basic_auth_middleware_1.fromUTF8ToBase64)(settings_1.SETTINGS.ADMIN);
    return `Basic ${codedAuth}`;
}
//# sourceMappingURL=generate-admin-auth-token.js.map