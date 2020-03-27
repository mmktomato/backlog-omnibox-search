import { LitElement, html, customElement, css } from "lit-element";

import "./list";

@customElement("options-outer")
class OptionsOuter extends LitElement {
  static get styles() {
    return css`
      div {
        text-align: right;
        padding-right: 30px;
        margin: 15px 0;
      }
      div > button {
        width: 60px;
        line-height: 1.5em;
      }
    `;
  }

  private handleSave() {
    console.log("hi");
  }

  render() {
    return html`
      <main>
        <options-list></options-list>
        <div>
          <button @click="${this.handleSave}">Save</button>
        </div>
      </main>
    `;
  }
}
