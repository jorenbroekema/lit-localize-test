import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit-element';

export declare class LocalizeHost {
  public static get deferRenderingUntilLocaleLoaded(): boolean;
  private __currentLocaleLoaded: boolean;
}

export declare function LocalizeMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<LocalizeHost> &
  Pick<typeof LocalizeHost, keyof typeof LocalizeHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type LocalizeMixin = typeof LocalizeMixinImplementation;
