import { LitElement, html, customElement, css } from "lit-element";

@customElement("usage-view")
class UsageView extends LitElement {
  static get styles() {
    return css`
      h2 {
        border-bottom: 1px solid #8e8e8e;
        font-size: 1.25em;
      }
    `;
  }

  render() {
    return html`
      <div>
        <h2>Example</h2>
        <usage-example></usage-example>
      </div>
    `;
  }
}

@customElement("usage-example")
class UsageExample extends LitElement {
  static get styles() {
    return css`
      table {
        border: 1px solid #ccc;
        border-collapse: collapse;
      }
      td {
        border: 1px solid #ccc;
        padding: .3em .5em;
      }
      td.query {
        white-space: nowrap;
      }
      thead {
        background: #d9d9d9;
      }
      code {
        padding: 0 .5em;
        border: 1px solid #aaa;
        border-radius: 2px;
        background: #eee;
        font-family: monospace;
      }
    `;
  }

  render() {
    return html`
      <table>
        <thead>
          <tr><td class="query">Query</td><td>Explanation</td></tr>
        </thead>
        <tbody>
          <tr>
            <td class="query"><code>b keyword</code></td>
            <td>Search <code>keyword</code> in the default project. Search in all projects if the default project key is not set.</td>
          </tr>
          <tr>
            <td class="query"><code>b keyword proj:MY_PROJ</code></td>
            <td>Search <code>keyword</code> in <code>MY_PROJ</code> project.</td>
          </tr>
        </tbody>
      </table>
    `;
  }
}
