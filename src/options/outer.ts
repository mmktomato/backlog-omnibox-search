import { LitElement, html, customElement } from "lit-element";

import "./list";
import type { OnChangeHandler } from "./list";
import type { Options } from "../type";
import { getOptions, setOptions } from "../storage";

@customElement("options-outer")
class OptionsOuter extends LitElement {
  private options: Options | null = null;

  async connectedCallback() {
    super.connectedCallback();

    this.options = await getOptions();
    this.requestUpdate();
  }

  private handleOnChange(...[key, value]: Parameters<OnChangeHandler>) {
    if (this.options) {
      this.options[key] = value.trim();
      setOptions(this.options);
    }
  }

  render() {
    return html`
      <main>
        <options-list .options=${this.options} .onChange=${this.handleOnChange}></options-list>
      </main>
    `;
  }
}
