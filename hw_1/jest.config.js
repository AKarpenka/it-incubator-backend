/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  preset: 'ts-jest',
  testTimeout: 100000, //от этой ошибки! -> thrown: "Exceeded timeout of 5000 ms for a test.
  testRegex: "__tests__/.*.e2e.test.ts$", //<-- чтобы запускались только файлы с расширением ".e2e.test.ts"
};
