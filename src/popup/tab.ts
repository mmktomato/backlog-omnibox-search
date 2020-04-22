import { LitElement, html, customElement, css, property } from "lit-element";
import { Message, MessageType, AppContextDto } from "../type";

const _browser: typeof browser = require("webextension-polyfill");

@customElement("tab-container")
class TabContainer extends LitElement {
  @property({ type: Number })
  selectedIndex = 0;

  static get styles() {
    return css`
      .row {
        position: relative;
        width: 100%;
        list-style: none;
        padding: 0 1em;
        cursor: default;
      }
      .row::after {
        position: absolute;
        content: "";
        width: 100%;
        bottom: 0;
        left: 0;
        border-bottom: 1px solid #AAA;
        z-index: 1;
      }
      .row > li {
        position: relative;
        display: inline-block;
        padding: 3px 10px 2px;
        z-index: 0;
      }
      .row > li.selected {
        border-top: 1px solid #AAA;
        border-right: 1px solid #AAA;
        border-left: 1px solid #AAA;
        border-bottom: 1px solid #FFF;
        z-index: 2;
      }
    `;
  }

  async connectedCallback() {
    super.connectedCallback();

    const message: Message = { type: MessageType.REQUIRE_APP_CONTEXT };
    const appContext = await _browser.runtime.sendMessage(message) as AppContextDto;
    this.selectedIndex = appContext.popupTabIndex;
  }

  onClick(index: number) {
    this.selectedIndex = index;

    const message: Message = { type: MessageType.UPDATE_APP_CONTEXT__POPUP_TAB_INDEX, value: index };
    _browser.runtime.sendMessage(message);
  }

  getClassName(index: number) {
    return index === this.selectedIndex ? "selected" : "";
  }

  render() {
    return html`
      <ul class="row">
        <li @click=${() => this.onClick(0)} class=${this.getClassName(0)}>
          <slot name="tab1Name"></slot>
        </li>
        <li @click=${() => this.onClick(1)} class=${this.getClassName(1)}>
          <slot name="tab2Name"></slot>
        </li>
      </ul>
      ${this.selectedIndex === 0
        ? html`<slot name="tab1Content"></slot>`
        : html`<slot name="tab2Content"></slot>`
      }
    `;
  }
}
