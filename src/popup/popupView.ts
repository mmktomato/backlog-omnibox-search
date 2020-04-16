import { LitElement, html, customElement, css } from "lit-element";

import "../options/optionsView";

@customElement("popup-view")
class PopupView extends LitElement {
  static get styles() {
    return css`
      div {
        width: 400px;
      }
    `;
  }

  render() {
    return html`
      <div>
        <options-view></options-view>
      </div>
    `;
  }
}
