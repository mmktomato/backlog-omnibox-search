import { LitElement, html, css, customElement, property } from "lit-element";

@customElement("options-list-item")
class OptionsListItem extends LitElement {
  @property()
  label = "";

  @property()
  value = "";

  @property()
  placeHolder = "";

  @property({ type: Boolean })
  required = false;

  @property({ type: Function })
  onInput: (value: string) => void = () => {};

  static get styles() {
    return css`
      .outer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1em 2em;
      }

      .required {
        color: #cc0000;
        font-size: 80%;
      }

      input::placeholder {
        font-size: 85%;
      }
    `;
  }

  render() {
    return html`
      <div class="outer">
        <div>
          <span>${this.label}</span>
          ${this.required ? html`<span class="required">(required)</span>` : null}
        </div>
        <input
          value=${this.value}
          placeholder=${this.placeHolder}
          @input=${(e: any) => this.onInput(e.currentTarget.value)}
        ></input>
      </div>
    `;
  }
}
