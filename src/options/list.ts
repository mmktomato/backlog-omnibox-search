import { LitElement, html, customElement, property } from "lit-element";

import "./listItem";
import { Options } from "../type";

export type OnInputHandler = (key: keyof Options, value: string) => void;

@customElement("options-list")
class OptionsList extends LitElement {
  @property({ type: Object })
  options: Partial<Options> = {};

  @property({ type: Function })
  onInput: OnInputHandler = () => {};

  render() {
    return html`
      <div>
        <options-list-item
          label="Default Base Url"
          value=${this.options.defaultBaseUrl ?? ""}
          placeHolder="https://yourspace.backlog.com"
          required=${true}
          .onInput=${(value: string) => this.onInput("defaultBaseUrl", value)}
        ></options-list-item>

        <options-list-item
          label="Default Project Key"
          value=${this.options.defaultProjectKey ?? ""}
          placeHolder="YOUR_PROJECT_KEY"
          .onInput=${(value: string) => this.onInput("defaultProjectKey", value)}
        ></options-list-item>
      </div>
    `;
  }
}
