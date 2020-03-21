const baseUrl = process.env.BASE_URL!;
const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;

const _browser: typeof browser = require("webextension-polyfill");

export const authorize = () => {
  const redirectUrl = _browser.identity.getRedirectURL();
  const url = new URL("/OAuth2AccessRequest.action", baseUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUrl);
  url.searchParams.set("state", "ssstate");

  _browser.identity.launchWebAuthFlow({ url: url.toString(), interactive: true })
    .then(res => {
      console.log(res);
      const code = new URL(res).searchParams.get("code");
      if (code) {
        getAccessToken(redirectUrl, code);
      } else {
        // TODO; fix this.
        console.error("No code found.");
      }
    });
};

const getAccessToken = (redirectUrl: string, code: string) => {
  const url = new URL("/api/v2/oauth2/token", baseUrl);
  const body = new URLSearchParams();
  body.set("grant_type", "authorization_code");
  body.set("code", code);
  body.set("redirect_uri", redirectUrl);
  body.set("client_id", clientId);
  body.set("client_secret", clientSecret);

  fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded"},
    body: body
  }).then(async (res) => {
    const json = await res.json();
    console.log(json);
  });
};
