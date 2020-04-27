import type { Issue, Project, SearchCondition } from "./type";

const createHeaders = (accessToken: string) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${accessToken}`
});

export const getIssues = async (accessToken: string, condition: SearchCondition) => {
  const url = new URL("/api/v2/issues", condition.baseUrl);

  if (condition.projectKey) {
    // TODO: better error handling
    const project = await getProject(accessToken, condition.baseUrl, condition.projectKey);
    url.searchParams.set("projectId[0]", project.id.toString());
  }

  // The number of results is up to 6.
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/omnibox/onInputChanged
  url.searchParams.set("count", "6");

  url.searchParams.set("keyword", condition.keyword);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(accessToken),
  });

  // TODO: validation
  return await res.json() as Issue[];
};

const getProject = async (accessToken: string, baseUrl: string, projectKey: string) => {
  const url = new URL(`/api/v2/projects/${projectKey}`, baseUrl);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(accessToken),
  });

  // TODO: validation
  return await res.json() as Project;
};
