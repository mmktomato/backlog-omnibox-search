jest.mock("webextension-polyfill");
import { findLast30DaysBacklogBaseUrl } from "./history";

const _browser: typeof browser = require("webextension-polyfill");

describe("findLast30DaysBacklogBaseUrl", () => {
  const backlogComHistory = { url: "https://a.backlog.com/dashboard" };
  const backlogJpHistory = { url: "https://a.backlog.jp/dashboard" };
  const backlogtoolComHistory = { url: "https://a.backlogtool.com/dashboard" };
  const ignoreHistories = [
    { url: "https://example.com" },
    { url: "https://backlog.com" },
    { url: "https://support.backlog.com" },
    { url: "https://support-ja.backlog.com" },
  ];

  it.each`
    description            | histories                                | expected
    ${"*.backlog.com"}     | ${[backlogComHistory]}                   | ${"https://a.backlog.com"}
    ${"*.backlog.jp"}      | ${[backlogJpHistory]}                    | ${"https://a.backlog.jp"}
    ${"*.backlogtool.com"} | ${[backlogtoolComHistory]}               | ${"https://a.backlogtool.com"}
    ${"ignore"}            | ${ignoreHistories}                       | ${null}
    ${"first history"}     | ${[backlogJpHistory, backlogComHistory]} | ${"https://a.backlog.jp"}
  `("returns baseUrl from history ($description).", async ({ histories, expected }) => {
    (_browser.history.search as jest.Mock).mockResolvedValueOnce(histories);

    expect(await findLast30DaysBacklogBaseUrl()).toEqual(expected);
  });
});
