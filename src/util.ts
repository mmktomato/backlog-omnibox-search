import type { Options } from "./type";

export const validateOptions = (options: Partial<Options>): options is Options => {
  return !!options.defaultBaseUrl;
};

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
