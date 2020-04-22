import type { SuggestResult } from "./type";
import { authorize, refreshAccessToken, isTokenAvailable } from "./auth";
import { getIssues } from "./backlog";
import { getTokens, setTokens, getOptions, setOptions } from "./storage";
import { validateOptions, escapeDescription, createIssueUrl, isEmptyTab, isFirefox } from "./util";
import { findLast30DaysBacklogBaseUrl } from "./history";
import { createSearchCondition } from "./keyword";
import { appContext } from "./context";

const _browser: typeof browser = require("webextension-polyfill");

const setDefaultSuggestion = (text: string) => {
  _browser.omnibox.setDefaultSuggestion({ description: text || " " });
};

const handleInputError = (ex: unknown) => {
  console.error(ex);

  if (ex instanceof Error) {
    setDefaultSuggestion(`Error (${ex.name}: ${ex.message}).`);
  } else {
    setDefaultSuggestion("Unexpected error.");
  }
};

export const onInputStarted = async () => {
  try {
    setDefaultSuggestion("Checking tokens...");

    const options = await getOptions();
    if (!validateOptions(options)) {
      return;
    }

    const tokens = await getTokens(options.defaultBaseUrl);
    if (tokens) {
      if (!isTokenAvailable(tokens)) {
        setDefaultSuggestion("Refreshing tokens...");

        const newTokens = await refreshAccessToken(options.defaultBaseUrl, tokens);
        await setTokens(options.defaultBaseUrl, newTokens);
      }
    } else {
      setDefaultSuggestion("Acquiring tokens...");

      const newTokens = await authorize(options.defaultBaseUrl);
      await setTokens(options.defaultBaseUrl, newTokens);
    }
    setDefaultSuggestion("Type search keyword.");
  } catch (ex) {
    handleInputError(ex);
  }
};

export const onInputChanged = async (text: string, suggest: (suggestResults: SuggestResult[]) => void) => {
  try {
    // TODO: Do nothing during acquiring token, refreshing token.

    const options = await getOptions();
    if (!validateOptions(options)) {
      setDefaultSuggestion("The configuration is not finished. Click here to finish configuration.");
      appContext.popupTabKey = "setting";
      return;
    }

    const condition = createSearchCondition(text, options);
    const tokens = await getTokens(condition.baseUrl);
    if (!tokens) {
      return;
    }

    if (!condition.keyword) {
      setDefaultSuggestion("Type search keyword.");
    } else {
      setDefaultSuggestion("Searching...");

      const issues = await getIssues(tokens.accessToken, condition);
      const suggestResults = issues.map(issue => ({
        description: escapeDescription(`${issue.issueKey} ${issue.summary}`),
        content: createIssueUrl(condition.baseUrl, issue.issueKey),
      }));
      suggest(suggestResults);

      let message = `Results of: "${condition.keyword}" in ${condition.projectKey ? condition.projectKey : "all projects"}.`;
      if (!isFirefox()) {
        // Known issue: Firefox doesn't allow to call `browserAction.openPopup()` in `onInputEntered`.
        message += " Click here for the usage.";
        appContext.popupTabKey = "usage";
      }
      setDefaultSuggestion(message);
    }
  } catch (ex) {
    handleInputError(ex);
  }
};

export const onInputEntered = async (url: string, disposition: string) => {
  try {
    if (!url.startsWith("https://")) {
      // Known issue: Firefox causes the error: `Error: browserAction.openPopup may only be called from a user input handler`.
      if (isFirefox()) {
        _browser.runtime.openOptionsPage();
      } else {
        _browser.browserAction.openPopup();
      }
      return;
    }

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
    handleInputError(ex);
  }
};

export const onStartup = async () => {
  try {
    console.log(_browser.identity.getRedirectURL());

    const options = await getOptions();
    if (!options.defaultBaseUrl) {
      const baseUrl = await findLast30DaysBacklogBaseUrl();
      if (baseUrl) {
        setOptions({ ...options, defaultBaseUrl: baseUrl });
      }
    }
  } catch (ex) {
    console.error(ex);
  }
};
