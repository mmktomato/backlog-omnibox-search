import { LitElement, html, customElement, property } from "lit-element";

import "./listItem";
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
          placeHolder="https://yourspace.backlog.com"
          required=${true}
          .onChange=${(value: string) => this.onChange("defaultBaseUrl", value)}
        ></options-list-item>

        <options-list-item
          label="Default Project Key"
          value=${this.options.defaultProjectKey ?? ""}
          placeHolder="YOUR_PROJECT_KEY"
          .onChange=${(value: string) => this.onChange("defaultProjectKey", value)}
        ></options-list-item>
      </div>
    `;
  }
}
