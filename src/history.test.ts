jest.mock("webextension-polyfill");
import { findLatestBaseUrlAndProjectKey } from "./history";

const _browser: typeof browser = require("webextension-polyfill");

describe("findLatestBaseUrlAndProjectKey", () => {
  const backlogComHistory = { url: "https://a.backlog.com/dashboard" };
  const backlogJpHistory = { url: "https://a.backlog.jp/dashboard" };
  const backlogtoolComHistory = { url: "https://a.backlogtool.com/dashboard" };
  const ignoreHistories = [
    { url: "https://example.com" },
    { url: "https://backlog.com" },
    { url: "https://support.backlog.com" },
    { url: "https://support-ja.backlog.com" },
  ];
  const backlogComIssueHistory = { url: "https://a.backlog.com/view/TEST-1234" };

  it.each`
    description                       | histories                                     | expected
    ${"*.backlog.com"}                | ${[backlogComHistory]}                        | ${["https://a.backlog.com", undefined]}
    ${"*.backlog.jp"}                 | ${[backlogJpHistory]}                         | ${["https://a.backlog.jp", undefined]}
    ${"*.backlogtool.com"}            | ${[backlogtoolComHistory]}                    | ${["https://a.backlogtool.com", undefined]}
    ${"ignore"}                       | ${ignoreHistories}                            | ${[undefined, undefined]}
    ${"with projectKey"}              | ${[backlogComIssueHistory]}                   | ${["https://a.backlog.com", "TEST"]}
    ${"gives priority to projectKey"} | ${[backlogJpHistory, backlogComIssueHistory]} | ${["https://a.backlog.com", "TEST"]}
  `("returns baseUrl and projectKey from history ($description).", ({ histories, expected }) => {
    (_browser.history.search as jest.Mock).mockResolvedValueOnce(histories);

    return expect(findLatestBaseUrlAndProjectKey(0)).resolves.toEqual(expected);
  });
});
