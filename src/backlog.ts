import type { Issue } from "./type";

// TODO: from option.
const baseUrl = process.env.BASE_URL!;

// TODO: from option. It should be "project key" not "project id".
const projectId = process.env.PROJECT_ID!

const createHeaders = (accessToken: string) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${accessToken}`
});

export const getIssues = async (accessToken: string, keyword: string) => {
  const url = new URL("/api/v2/issues", baseUrl);
  url.searchParams.set("projectId[0]", projectId);

  // The number of results is up to 6.
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/omnibox/onInputChanged
  url.searchParams.set("count", "6");

  if (keyword) {
    url.searchParams.set("keyword", keyword);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(accessToken),
  });

  return await res.json() as Issue[];
};
