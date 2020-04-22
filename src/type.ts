// Web Extension

export interface SuggestResult {
  description: string;
  content: string;
}

// Backlog

export interface Tokens {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  localTimestamp: number;
}

export interface Issue {
  summary: string;
  issueKey: string;
}

export interface Project {
  id: number;
}

// app

export interface Options {
  defaultBaseUrl: string;
  defaultProjectKey?: string;
}

export interface SearchCondition {
  keyword: string;
  baseUrl: string;
  projectKey?: string;
}

export interface AppContextDto {
  readonly popupTabIndex: number;
}

export enum MessageType {
  REQUIRE_APP_CONTEXT = 0,
  UPDATE_APP_CONTEXT__POPUP_TAB_INDEX,
}

export type Message =
  { type: MessageType.REQUIRE_APP_CONTEXT } |
  { type: MessageType.UPDATE_APP_CONTEXT__POPUP_TAB_INDEX, value: number };
