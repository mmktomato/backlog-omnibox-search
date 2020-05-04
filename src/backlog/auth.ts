import { Tokens, isTokenResponse } from "../type";
import { throwIfError } from "./";

const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;

const _browser: typeof browser = require("webextension-polyfill");

export const authorize = async (baseUrl: string) => {
  const redirectUrl = _browser.identity.getRedirectURL();
  // Firefox (development): https://4875c6a5f2e37fdedc9226a5dae93667a342f6e3.extensions.allizom.org/
  // Chrome (development): https://dlffeeggkjpankabiocfclohbdhpebho.chromiumapp.org/

  const state = Math.floor((Math.random() * 100000000)).toString();
  const url = new URL("/OAuth2AccessRequest.action", baseUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUrl);
  url.searchParams.set("state", state);

  const res = await _browser.identity.launchWebAuthFlow({ url: url.toString(), interactive: true });
  const returnUrl = new URL(res);

  if (returnUrl.searchParams.get("state") !== state) {
    throw new Error("State not matched.");
  }

  const code = returnUrl.searchParams.get("code");

  if (!code) {
    throw new Error("No code found.");
  }
  return await getAccessToken(baseUrl, redirectUrl, code);
};

const getAccessToken = (baseUrl: string, redirectUrl: string, code: string) => {
  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", redirectUrl);
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);

  return postTokenEndpoint(baseUrl, body);
};

export const refreshAccessToken = (baseUrl: string, tokens: Tokens) => {
  const body = new URLSearchParams();
  body.set("grant_type", "refresh_token");
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);
  body.set("refresh_token", tokens.refreshToken);

  return postTokenEndpoint(baseUrl, body);
};

const postTokenEndpoint = async (baseUrl: string, body: URLSearchParams): Promise<Tokens> => {
  const url = new URL("/api/v2/oauth2/token", baseUrl);

  const timestamp = new Date().getTime();
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded"},
    body: body
  });
  const responseBody = await throwIfError(res);

  if (responseBody && isTokenResponse(responseBody)) {
    return {
      accessToken: responseBody.access_token,
      expiresIn: responseBody.expires_in,
      refreshToken: responseBody.refresh_token,
      localTimestamp: timestamp,
    };
  }
  throw new Error("Unexpected response");
};

export const isTokenAvailable = (tokens: Tokens) => {
  const now = new Date().getTime();
  const elapsedInMsec = now - tokens.localTimestamp;
  const thresholdInSec = 60;

  return elapsedInMsec <= ((tokens.expiresIn - thresholdInSec) * 1000);
};
