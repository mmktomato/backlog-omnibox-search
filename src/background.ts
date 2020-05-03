import { debounce } from 'ts-debounce';
import { onInputStarted, onInputChanged, onInputEntered, onStartup } from "./handler";
import { MessageType, isMessage } from "./type";
import { appContext } from "./context";

const _browser: typeof browser = require("webextension-polyfill");

_browser.omnibox.onInputStarted.addListener(onInputStarted);

const onInputChangedDebounced = debounce(onInputChanged, 250);

_browser.omnibox.onInputChanged.addListener(onInputChangedDebounced);

_browser.omnibox.onInputEntered.addListener(onInputEntered);

onStartup();

_browser.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (!isMessage(message)) {
    return false;
  }

  switch (message.type) {
    case MessageType.REQUIRE_APP_CONTEXT:
      sendResponse(appContext.toDto());
      return false;

    case MessageType.UPDATE_APP_CONTEXT__POPUP_TAB_KEY:
      appContext.popupTabKey = message.value;
      return false;

    default:
      return false;
  }
});
