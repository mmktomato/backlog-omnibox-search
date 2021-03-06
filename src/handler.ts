import { SuggestResult, validateOptions } from "./type";
import { authorize, refreshAccessToken, isTokenAvailable } from "./backlog/auth";
import { getIssues } from "./backlog";
import { getTokens, setTokens, getOptions, setOptions } from "./storage";
import { escapeDescription, createIssueUrl, isEmptyTab, isFirefox } from "./util";
import { findLatestBaseUrlAndProjectKey } from "./history";
import { createSearchCondition } from "./keyword";
import { appContext } from "./context";

const _browser: typeof browser = require("webextension-polyfill");

const setDefaultSuggestion = (text: string) => {
  _browser.omnibox.setDefaultSuggestion({ description: text || " " });
};

const handleInputError = (ex: unknown) => {
  console.error(ex);

  if (ex instanceof Error) {
    setDefaultSuggestion(`${ex.name}: ${ex.message}`);
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
        appContext.isAquiringToken = true;
        setDefaultSuggestion("Refreshing tokens...");

        const newTokens = await refreshAccessToken(options.defaultBaseUrl, tokens);
        await setTokens(options.defaultBaseUrl, newTokens);
      }
    } else {
      appContext.isAquiringToken = true;
      setDefaultSuggestion("Acquiring tokens...");

      const newTokens = await authorize(options.defaultBaseUrl);
      await setTokens(options.defaultBaseUrl, newTokens);
    }
    setDefaultSuggestion("Type search keyword.");
  } catch (ex) {
    handleInputError(ex);
  } finally {
    appContext.isAquiringToken = false;
  }
};

export const onInputChanged = async (text: string, suggest: (suggestResults: SuggestResult[]) => void) => {
  try {
    if (appContext.isAquiringToken) {
      return;
    }

    const options = await getOptions();
    if (!validateOptions(options)) {
      setDefaultSuggestion("The configuration is not finished. Click here to finish configuration.");
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

      const inputId = appContext.incrementInputId();
      const issues = await getIssues(tokens.accessToken, condition);
      if (inputId !== appContext.inputId) {
        return;
      }

      const suggestResults = issues.map(issue => ({
        description: escapeDescription(`${issue.issueKey} ${issue.summary}`),
        content: createIssueUrl(condition.baseUrl, issue.issueKey),
      }));
      suggest(suggestResults);

      let message = `Results of: "${condition.keyword}" in ${condition.projectKey ? condition.projectKey : "all projects"}.`;
      setDefaultSuggestion(message);
    }
  } catch (ex) {
    handleInputError(ex);
  }
};

export const onInputEntered = async (url: string, disposition: string) => {
  try {
    if (!url.startsWith("https://")) {
      // appContext.popupTabKey = "usage";
      // appContext.popupTabKey = "setting";
      // _browser.browserAction.openPopup();
      //
      // Firefox 75 : Causes the error: `Error: browserAction.openPopup may only be called from a user input handler`.
      // Chrome 81  : `browserAction.openPopup` is behind of `chrome://flags`.

      _browser.runtime.openOptionsPage();
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
    if (!options.defaultBaseUrl) { // Allow empty for defaultProjectKey
      const [baseUrl, projectKey] = await findLatestBaseUrlAndProjectKey(30);

      if (baseUrl) {
        await setOptions({
          ...options,
          defaultBaseUrl: baseUrl,
          defaultProjectKey: projectKey,
        });
      }
    }
  } catch (ex) {
    console.error(ex);
  }
};
