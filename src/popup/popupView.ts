import { LitElement, html, customElement, css } from "lit-element";

import "./tab";
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
          <span slot="tab1Name">Settings</span>
          <options-view slot="tab1Content"></options-view>

          <span slot="tab2Name">TODO</span>
          <div slot="tab2Content">test test</div>
        </tab-container>
      </div>
    `;
  }
}
