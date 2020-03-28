import type { Options } from "./type";

export const validateOptions = (options: Partial<Options>): options is Options => {
  return !!options.defaultBaseUrl;
};

export const escapeDescription = (description: string) => {
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
