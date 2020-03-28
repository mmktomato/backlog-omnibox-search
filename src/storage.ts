import { Tokens, Options } from "./type";

const _browser: typeof browser = require("webextension-polyfill");

export const getTokens = async () => {
  const tokens = await _browser.storage.local.get(["accessToken", "expiresIn", "refreshToken" , "localTimestamp"]);

  return Object.keys(tokens).length < 1
    ? null
    : tokens as Tokens;
};

export const setTokens = async (tokens: Tokens) => {
  await _browser.storage.local.set({
    accessToken: tokens.accessToken,
    expiresIn: tokens.expiresIn,
    refreshToken: tokens.refreshToken,
    localTimestamp: tokens.localTimestamp,
  });
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
