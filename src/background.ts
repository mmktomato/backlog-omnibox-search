import { authorize } from "./auth";

const _browser: typeof browser = require("webextension-polyfill");

const setDefaultSuggestion = (text: string) => {
  _browser.omnibox.setDefaultSuggestion({ description: text || " " });
};

// setDefaultSuggestion("Type search keyword.");

_browser.omnibox.onInputStarted.addListener(() => {
  setDefaultSuggestion("Type search keyword.");

  console.log(_browser.identity.getRedirectURL());
  // Firefox: https://567159d622ffbb50b11b0efd307be358624a26ee.extensions.allizom.org/
  // Chrome: https://ahflghaojahgadhdpbeheifnjlaemcld.chromiumapp.org/

  authorize();
});

_browser.omnibox.onInputChanged.addListener((text, suggest) => {
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
