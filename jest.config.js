module.exports = {
  "transform": {
    "^.+\.ts$": "ts-jest"
  },
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.json"
    }
  },
  "testMatch": [
    "**/*.test.ts"
  ]
};
