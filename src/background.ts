import { debounce } from 'ts-debounce';

import type { SuggestResult } from "./type";
import { authorize, isTokenAvailable } from "./auth";
import { getTokens, setTokens } from "./storage";
import { getIssues } from "./backlog";

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
      setDefaultSuggestion("Acquiring tokens...");

      const newTokens = await authorize();
      await setTokens(newTokens);
    }
    setDefaultSuggestion("Type search keyword.");
  } catch (ex) {
    handleError(ex);
  }
});

const onInputChanged = async (text: string, suggest: (suggestResults: SuggestResult[]) => void) => {
  try {
    // TODO: Do nothing if acquiring or refreshing token.
    const tokens = await getTokens();
    if (!tokens) {
      return;
    }

    const keyword = text.trim();
    if (!keyword) {
      setDefaultSuggestion("Type search keyword.");
    } else {
      setDefaultSuggestion("Searching...");

      const issues = await getIssues(tokens.accessToken, keyword);
      const suggestResults = issues.map(issue => ({
        description: `${issue.issueKey} ${issue.summary}`, content: issue.issueKey,
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
