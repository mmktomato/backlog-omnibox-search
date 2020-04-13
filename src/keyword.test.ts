import { parseKeyword } from "./keyword";

describe("parseKeyword", () => {
  const keywordWithoutProjectKey = { keyword: "test1 test2" };
  const keywordWithProjectKey = { keyword: "test1 test2", projectKey: "KEY" };

  it.each`
    description                  | raw                               | expected
    ${"without proj"}            | ${"test1 test2"}                  | ${keywordWithoutProjectKey}
    ${"with proj"}               | ${"proj:KEY test1 test2"}         | ${keywordWithProjectKey}
    ${"with proj (white space)"} | ${"  proj:  KEY  test1  test2  "} | ${keywordWithProjectKey}
  `("parses raw keyword ($description).", ({ raw, expected }) => {
    expect(parseKeyword(raw)).toEqual(expected);
  });
});
