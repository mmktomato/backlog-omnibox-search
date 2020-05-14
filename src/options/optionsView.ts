import { debounce } from 'ts-debounce';
import { LitElement, html, customElement } from "lit-element";

import "./list";
import type { OnInputHandler } from "./list";
import type { Options } from "../type";
import { getOptions, setOptions } from "../storage";

const setOptionsDebounced = debounce(setOptions, 200);

@customElement("options-view")
class OptionsView extends LitElement {
  private options: Partial<Options> = {};

  async connectedCallback() {
    super.connectedCallback();

    this.options = await getOptions();
    this.requestUpdate();
  }

  private handleOnInput(...[key, value]: Parameters<OnInputHandler>) {
    this.options[key] = value.trim();
    setOptionsDebounced(this.options);
  }

  render() {
    return html`
      <options-list .options=${this.options} .onInput=${this.handleOnInput}></options-list>
    `;
  }
}
