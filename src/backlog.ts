import type { Issue, Project, Options } from "./type";

const createHeaders = (accessToken: string) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${accessToken}`
});

export const getIssues = async (accessToken: string, options: Options, keyword: string) => {
  const baseUrl = options.defaultBaseUrl;
  const projectKey = options.defaultProjectKey;

  const url = new URL("/api/v2/issues", baseUrl);

  if (projectKey) {
    const project = await getProject(accessToken, baseUrl, projectKey);
    url.searchParams.set("projectId[0]", project.id.toString());
  }

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

const getProject = async (accessToken: string, baseUrl: string, projectKey: string) => {
  const url = new URL(`/api/v2/projects/${projectKey}`, baseUrl);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(accessToken),
  });

  return await res.json() as Project;
};
