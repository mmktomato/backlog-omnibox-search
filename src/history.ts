const _browser: typeof browser = require("webextension-polyfill");

// TODO: unit test
export const findLast30DaysBacklogBaseUrl = async () => {
  const thirtyDaysAgo = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;

  const backlogHistories = await _browser.history.search({
    text: "backlog",
    startTime: thirtyDaysAgo,
    maxResults: 100,
  });

  const lastBacklogUrl = backlogHistories.reduce<URL | null>((acc, cur) => {
    if (acc || !cur.url) {
      return acc;
    }

    try {
      const url = new URL(cur.url);

      if (url.protocol === "https:") {
        const m = url.hostname.toLowerCase().match(/^(?:(?:(.+)\.backlog.(?:com|jp))|(?:^(.+)\.backlogtool.com))$/);
        const subdomain = m && (m[1] || m[2]);

        if (subdomain && !["support", "support-ja"].includes(subdomain)) {
          acc = url;
        }
      }
    } catch {
      // ignore
    }
    return acc;
  }, null);

  if (!lastBacklogUrl) {
    return null;
  }
  return `https://${lastBacklogUrl.hostname}`;
};
