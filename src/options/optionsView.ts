import { LitElement, html, customElement, css } from "lit-element";

import "./list";
import type { OnChangeHandler } from "./list";
import type { Options } from "../type";
import { setTokens, getOptions, setOptions } from "../storage";
import { authorize } from "../auth";

@customElement("options-view")
class OptionsView extends LitElement {
  private options: Partial<Options> = {};

  async connectedCallback() {
    super.connectedCallback();

    this.options = await getOptions();
    this.requestUpdate();
  }

  static get styles() {
    return css`
      .buttonOuter {
        text-align: right;
      }

      button {
        margin: 0.5em 2em;
      }
    `;
  }

  private handleOnChange(...[key, value]: Parameters<OnChangeHandler>) {
    this.options[key] = value.trim();
    setOptions(this.options);
  }

  private async authorize() {
    if (this.options.defaultBaseUrl) {
      const newTokens = await authorize(this.options.defaultBaseUrl);
      await setTokens(this.options.defaultBaseUrl, newTokens);
    }
  }

  render() {
    return html`
      <options-list .options=${this.options} .onChange=${this.handleOnChange}></options-list>
      <div class="buttonOuter">
        <button @click=${this.authorize}>Authorize</button>
      </div>
    `;
  }
}
