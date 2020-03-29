import { Tokens, Options } from "./type";

const _browser: typeof browser = require("webextension-polyfill");

type TokensArray = [
  Tokens["accessToken"],
  Tokens["expiresIn"],
  Tokens["refreshToken"],
  Tokens["localTimestamp"],
];

export const getTokens = async (baseUrl: string) => {
  const key = `${baseUrl}_tokens`;
  const obj = await _browser.storage.local.get(key);

  if (!obj || !obj[key] || !Array.isArray(obj[key])) {
    return null;
  }
  const arr = obj[key] as TokensArray;

  const tokens: Tokens = {
    accessToken: arr[0],
    expiresIn: arr[1],
    refreshToken: arr[2],
    localTimestamp: arr[3],
  };
  return tokens;
};

export const setTokens = async (baseUrl: string, tokens: Tokens) => {
  const key = `${baseUrl}_tokens`;
  const arr: TokensArray = [
    tokens.accessToken,
    tokens.expiresIn,
    tokens.refreshToken,
    tokens.localTimestamp,
  ];
  await _browser.storage.local.set({ [key]: arr });
};

export const getOptions = async () => {
  const options = await _browser.storage.sync.get(["defaultBaseUrl", "defaultProjectKey"]);

  return options as Partial<Options>;
};

export const setOptions = async (options: Partial<Options>) => {
  await _browser.storage.sync.set({
    defaultBaseUrl: options.defaultBaseUrl,
    defaultProjectKey: options.defaultProjectKey,
  });
};
