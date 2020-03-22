import { authorize, isTokenAvailable } from "./auth";
import { getTokens, setTokens } from "./storage";

const _browser: typeof browser = require("webextension-polyfill");

const setDefaultSuggestion = (text: string) => {
  _browser.omnibox.setDefaultSuggestion({ description: text || " " });
};

// setDefaultSuggestion("Type search keyword.");

_browser.omnibox.onInputStarted.addListener(async () => {
  setDefaultSuggestion("Checking tokens...");

  try {
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
    console.error(ex);
    setDefaultSuggestion(`Error (${(ex as Error).name}: ${(ex as Error).message})`);
  }
});

_browser.omnibox.onInputChanged.addListener((text, suggest) => {
  // TODO: Do nothing if acquiring or refreshing token.

  // TODO: debounce
  //       https://www.npmjs.com/package/ts-debounce
  //       https://www.npmjs.com/package/lodash.debounce

  if (!text.trim()) {
    setDefaultSuggestion("Type search keyword.");
  } else {
    setDefaultSuggestion("Searching...");

    setTimeout(() => {
      suggest([
        { description: `tes1 ${text}`, content: "con1" },
        { description: `tes2 ${text}`, content: "con2" },
      ]);
      setDefaultSuggestion("Result of: " + text);
    }, 1000);
  }
});

_browser.omnibox.onInputEntered.addListener((text, disposition) => {
  console.log(`onInputEntered: ${text}`);
  console.log(`onInputEntered: ${disposition}`);
});

// _browser.omnibox.onInputCancelled.addListener(() => {
//   console.log("onInputCancelled");
// });
