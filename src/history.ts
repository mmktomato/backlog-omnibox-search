const _browser: typeof browser = require("webextension-polyfill");

const findBacklogUrls = async (days: number, callback: (url: URL) => boolean) => {
  const nDaysAgo = new Date().getTime() - days * 24 * 60 * 60 * 1000;

  const backlogHistories = await _browser.history.search({
    text: "backlog",
    startTime: nDaysAgo,
    maxResults: 100,
  });

  for (const item of backlogHistories) {
    try {
      if (!item.url) {
        continue;
      }

      const url = new URL(item.url);

      if (url.protocol === "https:") {
        const m = url.hostname.toLowerCase().match(/^(?:(?:(.+)\.backlog.(?:com|jp))|(?:^(.+)\.backlogtool.com))$/);
        const subdomain = m && (m[1] || m[2]);

        if (subdomain && !["support", "support-ja"].includes(subdomain)) {
          if (!callback(url)) {
            break;
          }
        }
      }
    } catch {
      // ignore
    }
  }
};

// TODO: add unit test
export const findLatestBaseUrlAndProjectKey = async (days: number) => {
  let baseUrl: string | undefined = undefined;
  let projectKey: string | undefined = undefined;

  await findBacklogUrls(days, (url) => {
    if (!baseUrl) {
      baseUrl = `${url.protocol}//${url.hostname}`;
    }

    if (!projectKey && url.pathname.startsWith("/view/")) {
      const issueKey = url.pathname.split("/")[2];
      projectKey = issueKey.split("-")[0];
    }

    return !baseUrl || !projectKey;
  });

  return [baseUrl, projectKey];
};
