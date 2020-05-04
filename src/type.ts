// Web Extension

export interface SuggestResult {
  description: string;
  content: string;
}

// Backlog

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export const isTokenResponse = (res: any): res is TokenResponse => {
  return typeof(res) === "object"
    && typeof(res.access_token) === "string"
    && typeof(res.expires_in) === "number"
    && typeof(res.refresh_token) === "string";
};

export interface Issue {
  summary: string;
  issueKey: string;
}

export const isIssue = (issue: any): issue is Issue => {
  return typeof(issue) === "object" && typeof(issue.summary) === "string" && typeof(issue.issueKey) === "string";
};

export interface Project {
  id: number;
}

export const isProject = (project: any): project is Project => {
  return typeof(project) === "object" && typeof(project.id) === "number";
};

// app

export interface Tokens {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  localTimestamp: number;
}

export interface Options {
  defaultBaseUrl: string;
  defaultProjectKey?: string;
}

export const validateOptions = (options: Partial<Options>): options is Options => {
  return !!options.defaultBaseUrl;
};

export interface SearchCondition {
  keyword: string;
  baseUrl: string;
  projectKey?: string;
}

export interface AppContextDto {
  readonly popupTabKey: PopupTabKey;
}

export type PopupTabKey = "usage" | "setting";

export enum MessageType {
  REQUIRE_APP_CONTEXT = 0,
  UPDATE_APP_CONTEXT__POPUP_TAB_KEY,
}

export type Message =
  { type: MessageType.REQUIRE_APP_CONTEXT } |
  { type: MessageType.UPDATE_APP_CONTEXT__POPUP_TAB_KEY, value: PopupTabKey };

export const isMessage = (message: any): message is Message => {
  return typeof(message) === "object" && typeof(message.type) === "number";
};
