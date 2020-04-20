import { createSearchCondition } from "./keyword";

const defaultBaseUrl = "https://a.backlog.com";

describe("createSearchCondition (parse keyword)", () => {
  const options = { defaultBaseUrl };

  const conditionWithoutProjectKey = {
    keyword: "test1 test2",
    baseUrl: defaultBaseUrl,
  };
  const conditionWithProjectKey = { ...conditionWithoutProjectKey, projectKey: "KEY" };

  it.each`
    description                  | query                             | expected
    ${"without proj"}            | ${"test1 test2"}                  | ${conditionWithoutProjectKey}
    ${"with proj"}               | ${"proj:KEY test1 test2"}         | ${conditionWithProjectKey}
    ${"with proj (white space)"} | ${"  proj:  KEY  test1  test2  "} | ${conditionWithProjectKey}
  `("parses raw keyword ($description).", ({ query, expected }) => {
    expect(createSearchCondition(query, options)).toEqual(expected);
  });
});

describe("createSearchCondition (project key)", () => {
  const options = { defaultBaseUrl, defaultProjectKey: "DEFAULT_KEY" };

  const conditionWithDefaultProjectKey = {
    keyword: "test1 test2",
    baseUrl: defaultBaseUrl,
    projectKey: "DEFAULT_KEY",
  };
  const conditionWithProjectKey = { ...conditionWithDefaultProjectKey, projectKey: "KEY" };

  it.each`
    description                  | query                             | expected
    ${"without proj"}            | ${"test1 test2"}                  | ${conditionWithDefaultProjectKey}
    ${"with proj"}               | ${"proj:KEY test1 test2"}         | ${conditionWithProjectKey}
  `("parses raw keyword ($description).", ({ query, expected }) => {
    expect(createSearchCondition(query, options)).toEqual(expected);
  });
});
