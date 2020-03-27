import { Tokens } from "./type";

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
