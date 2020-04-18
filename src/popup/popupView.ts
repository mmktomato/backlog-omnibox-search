import { LitElement, html, customElement, css } from "lit-element";

import "./tab";
import "./usageView";
import "../options/optionsView";

@customElement("popup-view")
class PopupView extends LitElement {
  static get styles() {
    return css`
      div {
        width: 450px;
      }
    `;
  }

  render() {
    return html`
      <div>
        <tab-container>
          <span slot="tab1Name">Usage</span>
          <usage-view slot="tab1Content"></usage-view>

          <span slot="tab2Name">Settings</span>
          <options-view slot="tab2Content"></options-view>
        </tab-container>
      </div>
    `;
  }
}
