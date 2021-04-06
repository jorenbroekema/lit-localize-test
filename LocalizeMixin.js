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
export const LocalizeMixin = (superclass) =>
  class extends Localized(superclass) {
    constructor() {
      super();
      this.deferRenderingUntilLocaleLoaded = false;
      this.currentLocaleLoaded = false;
      this.__lionLocalizeEventHandler = /** @param {CustomEvent<LocaleStatusEventDetail>} event */ (
        event,
      ) => {
        if (
          event.detail.status === 'ready' &&
          event.detail.readyLocale === getLocale()
        ) {
          this.currentLocaleLoaded = true;
          this.requestUpdate();
        }
      };
    }

    connectedCallback() {
      super.connectedCallback();
      window.addEventListener(
        LOCALE_STATUS_EVENT,
        this.__lionLocalizeEventHandler,
      );
    }

    disconnectedCallback() {
      window.removeEventListener(
        LOCALE_STATUS_EVENT,
        this.__lionLocalizeEventHandler,
      );
      super.disconnectedCallback();
    }

    /**
     * @param {PropertyValues} changedProperties
     */
    shouldUpdate(changedProperties) {
      if (this.deferRenderingUntilLocaleLoaded && !this.currentLocaleLoaded) {
        return false;
      }
      return true;
    }
  };
