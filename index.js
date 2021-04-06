import { LitElement, html } from 'lit-element';
import { Localized } from '@lit/localize/localized-element.js';
import { msg, configureLocalization } from '@lit/localize';
import { LocalizeMixin } from './LocalizeMixin';

/**
 * Fetch translations from third party
 * @param {string} url
 */
const _fetch = async (url) => {
  const response = await fetch(url);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const result = await response.json();
  return result;
};

const localization = configureLocalization({
  sourceLocale: 'en-GB',
  targetLocales: ['nl-NL'],
  // loadLocale: (locale) => import(`/translations/${locale}-handwritten.js`),
  loadLocale: (locale) => _fetch(`/translations/${locale}-handwritten.json`),
});

localization.setLocale('nl-NL');

export const setLocale = localization.setLocale;
export const getLocale = localization.getLocale;

class AppShell extends LocalizeMixin(LitElement) {
  constructor() {
    super();
    this.deferRenderingUntilLocaleLoaded = true;
  }

  render() {
    return html`
      <h1>${msg(html`Hello, World!`, { id: 'title' })}</h1>
      <div class="btn-group">
        <button @click=${() => setLocale('en-GB')} id="en-GB">en-GB</button>
        <button @click=${() => setLocale('nl-NL')} id="nl-NL">nl-NL</button>
      </div>
    `;
  }
}
customElements.define('app-shell', AppShell);
