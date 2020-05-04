import { Issue, isIssue, isProject, SearchCondition } from "../type";

interface ApiError {
  errors: {
    message: string;
    code: number;
    moreInfo: string;
  }[];
}

const isApiError = (obj: any): obj is ApiError => {
  return obj && obj.errors && Array.isArray(obj.errors) && 0 < obj.errors.length;
};

const joinApiErrorMessage = (apiError: ApiError) => {
  return apiError.errors
    .map(err => err.moreInfo ? `${err.message} ${err.moreInfo}` : err.message)
    .join(" / ");
};

export const throwIfError = async (res: Response) => {
  const body = await res.json();

  if (res.status === 200) {
    return body;
  } else if (isApiError(body)) {
    throw new Error(joinApiErrorMessage(body));
  }
  throw new Error(`${res.status} ${res.statusText}`);
};

const createHeaders = (accessToken: string) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${accessToken}`
});

export const getIssues = async (accessToken: string, condition: SearchCondition) => {
  const url = new URL("/api/v2/issues", condition.baseUrl);

  if (condition.projectKey) {
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
  const body = await throwIfError(res);

  if (body && Array.isArray(body) && body.every(isIssue)) {
    return body as Issue[];
  }
  throw new Error("Unexpected response");
};

const getProject = async (accessToken: string, baseUrl: string, projectKey: string) => {
  const url = new URL(`/api/v2/projects/${projectKey}`, baseUrl);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: createHeaders(accessToken),
  });
  const body = await throwIfError(res);

  if (body && isProject(body)) {
    return body;
  }
  throw new Error("Unexpected response");
};
