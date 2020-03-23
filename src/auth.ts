import type { Tokens } from "./type";

// TODO: from option.
const baseUrl = process.env.BASE_URL!;

const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;

const _browser: typeof browser = require("webextension-polyfill");

export const authorize = async () => {
  const redirectUrl = _browser.identity.getRedirectURL();
  // Firefox: https://567159d622ffbb50b11b0efd307be358624a26ee.extensions.allizom.org/
  // Chrome: https://ahflghaojahgadhdpbeheifnjlaemcld.chromiumapp.org/

  const url = new URL("/OAuth2AccessRequest.action", baseUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUrl);
  url.searchParams.set("state", "ssstate");

  const res = await _browser.identity.launchWebAuthFlow({ url: url.toString(), interactive: true });
  const code = new URL(res).searchParams.get("code");

  if (!code) {
    throw new Error("No code found.");
  }
  return await getAccessToken(redirectUrl, code);
};

const getAccessToken = async (redirectUrl: string, code: string) => {
  const url = new URL("/api/v2/oauth2/token", baseUrl);
  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", redirectUrl);
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);

  const timestamp = new Date().getTime();
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded"},
    body: body
  });

  const obj = await res.json();  // TODO: assertion

  return {
    accessToken: obj.access_token,
    expiresIn: obj.expires_in,
    refreshToken: obj.refresh_token,
    localTimestamp: timestamp,
  } as Tokens;
};

export const isTokenAvailable = (tokens: Tokens) => {
  const now = new Date().getTime();
  const elapsedInMsec = now - tokens.localTimestamp;
  const thresholdInSec = 60;

  return elapsedInMsec <= ((tokens.expiresIn - thresholdInSec) * 1000);
};
