import { debounce } from 'ts-debounce';

import type { SuggestResult } from "./type";
import { authorize, isTokenAvailable } from "./auth";
import { getIssues } from "./backlog";
import { getTokens, setTokens, getOptions } from "./storage";
import { validateOptions, escapeDescription } from "./util";

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

    const tokens = await getTokens();
    if (tokens) {
      if (!isTokenAvailable(tokens)) {
        setDefaultSuggestion("Refreshing tokens...");

        // TODO: refresh
        throw new Error("fix this");
      }
    } else {
      const options = await getOptions();
      if (validateOptions(options)) {
        setDefaultSuggestion("Acquiring tokens...");

        const newTokens = await authorize(options);
        await setTokens(newTokens);

        setDefaultSuggestion("Type search keyword.");
      } else {
        setDefaultSuggestion("The configuration is not finished.");
      }
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
    const tokens = await getTokens();
    if (!tokens) {
      return;
    }

    const keyword = text.trim();
    if (!keyword) {
      setDefaultSuggestion("Type search keyword.");
    } else {
      setDefaultSuggestion("Searching...");

      const issues = await getIssues(tokens.accessToken, options, keyword);
      console.log(issues.map(issue => issue.summary));
      const suggestResults = issues.map(issue => ({
        // TODO: I have to escape some chars because `description` can take XML in chrome.
        //       What about Firefox?
        description: escapeDescription(`${issue.issueKey} ${issue.summary}`),
        content: issue.issueKey,
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

_browser.omnibox.onInputEntered.addListener((url, disposition) => {
  try {
    console.log(`onInputEntered: ${url}`);
    console.log(`onInputEntered: ${disposition}`);
  } catch (ex) {
    handleError(ex);
  }
});

// _browser.omnibox.onInputCancelled.addListener(() => {
//   console.log("onInputCancelled");
// });
