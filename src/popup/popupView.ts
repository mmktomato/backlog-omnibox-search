import { LitElement, html, customElement, css } from "lit-element";
import { Message, MessageType, AppContextDto, PopupTabKey } from "../type";

import "./tab";
import "./usageView";
import "../options/optionsView";

const _browser: typeof browser = require("webextension-polyfill");

@customElement("popup-view")
class PopupView extends LitElement {
  selectedTab: PopupTabKey = "usage";

  static get styles() {
    return css`
      div {
        width: 450px;
      }
    `;
  }

  async connectedCallback() {
    super.connectedCallback();

    const message: Message = { type: MessageType.REQUIRE_APP_CONTEXT };
    const appContext = await _browser.runtime.sendMessage(message) as AppContextDto;
    this.selectedTab = appContext.popupTabKey;

    this.requestUpdate();
  }

  onTabChange(index: number) {
    const message: Message = {
      type: MessageType.UPDATE_APP_CONTEXT__POPUP_TAB_KEY,
      value: index === 0 ? "usage" : "setting",
    };
    _browser.runtime.sendMessage(message);
  }

  selectedTabIndex() {
    return this.selectedTab === "usage" ? 0 : 1;
  }

  render() {
    return html`
      <div>
        <tab-container .selectedIndex=${this.selectedTabIndex()} .onTabChange=${this.onTabChange}>
          <span slot="tab1Name">Usage</span>
          <usage-view slot="tab1Content"></usage-view>

          <span slot="tab2Name">Settings</span>
          <options-view slot="tab2Content"></options-view>
        </tab-container>
      </div>
    `;
  }
}
