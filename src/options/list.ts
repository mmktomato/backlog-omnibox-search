import { LitElement, html, css, customElement, property } from "lit-element";

import { Options } from "../type";

export type OnChangeHandler = (key: keyof Options, value: string) => void;

@customElement("options-list")
class OptionsList extends LitElement {
  @property({ type: Object })
  options: Partial<Options> = {};

  @property({ type: Function })
  onChange: OnChangeHandler = () => {};

  render() {
    return html`
      <div>
        <options-list-item
          label="Default Base Url"
          value=${this.options.defaultBaseUrl ?? ""}
          .onChange=${(value: string) => this.onChange("defaultBaseUrl", value)}
        ></options-list-item>

        <options-list-item
          label="Default Project Key"
          value=${this.options.defaultProjectKey ?? ""}
          .onChange=${(value: string) => this.onChange("defaultProjectKey", value)}
        ></options-list-item>
      </div>
    `;
  }
}

@customElement("options-list-item")
class OptionsListItem extends LitElement {
  @property()
  label = "";

  @property()
  value = "";

  @property({ type: Function })
  onChange: (value: string) => void = () => {};

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
        <input value="${this.value}" @change=${(e: any) => this.onChange(e.currentTarget.value)}></input>
      </div>
    `;
  }
}
