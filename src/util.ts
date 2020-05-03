import type { Options, Message } from "./type";

export const escapeDescription = (description: string) => {
  // Escape some chars because `description` can take XML in Chrome.
  // https://developer.chrome.com/extensions/omnibox#type-SuggestResult
  if (isFirefox()) {
    return description;
  }

  return description.replace(/[<>&'"]/g, c => {
    switch (c) {
      case "<": return '&lt;';
      case ">": return '&gt;';
      case "&": return '&amp;';
      case "'": return '&apos;';
      case "\"": return '&quot;';
    }
    return c;
  });
};

export const isFirefox = () => navigator.userAgent.includes("Firefox");

export const createIssueUrl = (baseUrl: string, issueKey: string) => {
  const url = new URL(`/view/${issueKey}`, baseUrl);
  return url.toString();
};

export const isEmptyTab = (url?: string) => !!url?.startsWith(isFirefox() ? "about:newtab" : "chrome://newtab");
