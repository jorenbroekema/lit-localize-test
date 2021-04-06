import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { Localized } from '@lit/localize/localized-element';
import { LOCALE_STATUS_EVENT } from '@lit/localize';
import { LitElement } from 'lit-element';
import { setLocale, getLocale } from './index.js';

/**
 * @typedef {import('./LocalizeMixinTypes').LocalizeMixin} LocalizeMixin
 * @typedef {import('lit-element').PropertyValues} PropertyValues
 * @typedef {import('@lit/localize').LocaleStatusEventDetail} LocaleStatusEventDetail
 */

/**
 * @type {LocalizeMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<LitElement>} superclass
 */
const LocalizeMixinImplementation = (superclass) =>
  class LocalizeMixin extends Localized(superclass) {
    static get deferRenderingUntilLocaleLoaded() {
      return false;
    }

    constructor() {
      super();
      this.__currentLocaleLoaded = false;

      // Defer rendering until translations are loaded for the current locale
      this.__lionLocalizeEventHandler = /** @param {CustomEvent<LocaleStatusEventDetail>} event */ (
        event,
      ) => {
        if (event.detail.status === 'ready' && event.detail.readyLocale === getLocale()) {
          this.__currentLocaleLoaded = true;
          this.requestUpdate();
        }
      };
    }

    connectedCallback() {
      super.connectedCallback();
      window.addEventListener(LOCALE_STATUS_EVENT, this.__lionLocalizeEventHandler);
    }

    disconnectedCallback() {
      window.removeEventListener(LOCALE_STATUS_EVENT, this.__lionLocalizeEventHandler);
      super.disconnectedCallback();
    }

    /**
     * @param {PropertyValues} changedProperties
     */
    shouldUpdate(changedProperties) {
      const ctor = /** @type {typeof LocalizeMixin} */ (this.constructor);
      if (ctor.deferRenderingUntilLocaleLoaded && !this.__currentLocaleLoaded) {
        return false;
      }
      return true;
    }
  };
export const LocalizeMixin = dedupeMixin(LocalizeMixinImplementation);
