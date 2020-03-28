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
  defaultBaseUrl?: string;
  defaultProjectKey?: string;
}
