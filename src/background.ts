import { debounce } from 'ts-debounce';
import { onInputStarted, onInputChanged, onInputEntered, onStartup } from "./handler";

const _browser: typeof browser = require("webextension-polyfill");

_browser.omnibox.onInputStarted.addListener(onInputStarted);

const onInputChangedDebounced = debounce(onInputChanged, 250);

_browser.omnibox.onInputChanged.addListener(onInputChangedDebounced);

_browser.omnibox.onInputEntered.addListener(onInputEntered);

onStartup();
