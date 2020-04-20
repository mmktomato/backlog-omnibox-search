import type { SearchCondition, Options } from "./type";

export const createSearchCondition = (query: string, options: Options): SearchCondition => {
  const data = parseKeyword(query);

  return {
    keyword: data.keyword,
    baseUrl: options.defaultBaseUrl,
    projectKey: data.projectKey || options.defaultProjectKey,
  };
};

const parseKeyword = (raw: string) => {
  const tokens = normalize(raw);

  let projectKey: string | undefined = undefined;
  const keywordTokens = tokens.reduce<string[]>((acc, cur) => {
    if (cur.startsWith("proj:")) {
      projectKey = cur.slice(5);
    } else {
      acc.push(cur);
    }
    return acc;
  }, []);

  return {
    keyword: keywordTokens.join(" "),
    projectKey: projectKey,
  };
};

const normalize = (raw: string) => {
  const tokens = raw.trim().split(" ");

  return tokens
    .filter(token => !!token)
    .reduce<string[]>((acc, cur) => {
      if (0 < acc.length && acc[acc.length - 1] === "proj:") {
        acc[acc.length - 1] += cur;
      } else {
        acc.push(cur);
      }
      return acc;
    }, []);
};
