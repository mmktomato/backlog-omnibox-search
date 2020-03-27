import { LitElement, html, css, customElement, property } from "lit-element";

@customElement("options-list")
class OptionsList extends LitElement {
  render() {
    return html`
      <div>
        <options-list-item label="Default Base Url"></options-list-item>
        <options-list-item label="Default Project Key"></options-list-item>
      </div>
    `;
  }
}

@customElement("options-list-item")
class OptionsListItem extends LitElement {
  @property()
  label = ""

  static get styles() {
    return css`
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1em 2em;
      }
    `;
  }

  render() {
    return html`
      <div>
        <span>${this.label}</span>
        <input></input>
      </div>
    `;
  }
}
