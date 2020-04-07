import { debounce } from 'ts-debounce';

import type { SuggestResult } from "./type";
import { authorize, refreshAccessToken, isTokenAvailable } from "./auth";
import { getIssues } from "./backlog";
import { getTokens, setTokens, getOptions } from "./storage";
import { validateOptions, escapeDescription, createIssueUrl, isEmptyTab } from "./util";

const _browser: typeof browser = require("webextension-polyfill");

const setDefaultSuggestion = (text: string) => {
  _browser.omnibox.setDefaultSuggestion({ description: text || " " });
};

const handleError = (ex: unknown) => {
  console.error(ex);

  if (ex instanceof Error) {
    setDefaultSuggestion(`Error (${ex.name}: ${ex.message}).`);
  } else {
    setDefaultSuggestion("Unexpected error.");
  }
};

_browser.omnibox.onInputStarted.addListener(async () => {
  try {
    setDefaultSuggestion("Checking tokens...");

    const options = await getOptions();
    if (validateOptions(options)) {
      const tokens = await getTokens(options.defaultBaseUrl);
      if (tokens) {
        if (!isTokenAvailable(tokens)) {
          setDefaultSuggestion("Refreshing tokens...");

          const newTokens = await refreshAccessToken(options, tokens);
          await setTokens(options.defaultBaseUrl, newTokens);
        }
      } else {
        setDefaultSuggestion("Acquiring tokens...");

        const newTokens = await authorize(options);
        await setTokens(options.defaultBaseUrl, newTokens);
      }
      setDefaultSuggestion("Type search keyword.");
    } else {
      setDefaultSuggestion("The configuration is not finished.");
    }
  } catch (ex) {
    handleError(ex);
  }
});

const onInputChanged = async (text: string, suggest: (suggestResults: SuggestResult[]) => void) => {
  try {
    // TODO: Do nothing during acquiring token, refreshing token, or configuration.
    const options = await getOptions();
    if (!validateOptions(options)) {
      return;
    }
    const tokens = await getTokens(options.defaultBaseUrl);
    if (!tokens) {
      return;
    }

    const keyword = text.trim();
    if (!keyword) {
      setDefaultSuggestion("Type search keyword.");
    } else {
      setDefaultSuggestion("Searching...");

      const issues = await getIssues(tokens.accessToken, options, keyword);
      const suggestResults = issues.map(issue => ({
        description: escapeDescription(`${issue.issueKey} ${issue.summary}`),
        content: createIssueUrl(options.defaultBaseUrl, issue.issueKey),
      }));
      suggest(suggestResults);
      setDefaultSuggestion("Result of: " + keyword);
    }
  } catch (ex) {
    handleError(ex);
  }
};
const onInputChangedDebounced = debounce(onInputChanged, 250);

_browser.omnibox.onInputChanged.addListener(onInputChangedDebounced);

_browser.omnibox.onInputEntered.addListener(async (url, disposition) => {
  try {
    const matchTabs = await _browser.tabs.query({ url });
    if (0 < matchTabs.length) {
      const currentTabs = await _browser.tabs.query({ active: true, windowId: _browser.windows.WINDOW_ID_CURRENT });

      if (0 < currentTabs.length && isEmptyTab(currentTabs[0].url)) {
        _browser.tabs.remove(currentTabs[0].id!);
      }

      _browser.tabs.update(matchTabs[0].id!, { active: true });
      return;
    }

    switch (disposition) {
      case "currentTab":
        _browser.tabs.update({ url });
        break;
      case "newForegroundTab":
        _browser.tabs.create({ url });
        break;
      case "newBackgroundTab":
        _browser.tabs.create({ url, active: false });
        break;
    }
  } catch (ex) {
    handleError(ex);
  }
});

// _browser.omnibox.onInputCancelled.addListener(() => {
//   console.log("onInputCancelled");
// });

console.log(_browser.identity.getRedirectURL());
