import { LitElement, html, customElement, css } from "lit-element";

const commonStyles = css`
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

@customElement("usage-view")
class UsageView extends LitElement {
  static get styles() {
    return [
      commonStyles,
      css`
        h2 {
          font-size: 1.25em;
        }
        section {
          margin-bottom: 30px;
        }
        p {
          padding: .5em;
        }
      `,
    ];
  }

  render() {
    return html`
      <section>
        <p>
          Type <code>b</code> and press space key in the address bar. It searches for the issues in Backlog.
        </p>
      </section>
      <section>
        <h2>Example</h2>
        <usage-example></usage-example>
      </section>
    `;
  }
}

@customElement("usage-example")
class UsageExample extends LitElement {
  static get styles() {
    return commonStyles;
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
            <td>Search by <code>keyword</code> in the default project.<br />Search in all projects if the default project key is not set.</td>
          </tr>
          <tr>
            <td class="query"><code>b keyword proj:MY_PROJ</code></td>
            <td>Search by <code>keyword</code> in <code>MY_PROJ</code> project.</td>
          </tr>
        </tbody>
      </table>
    `;
  }
}
