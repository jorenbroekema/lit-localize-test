# Localization Requirements

## Locale

In general we must have a locale prop that we can change on an application level. This needs to play nicely with third party tools.

- ✅ Global singleton that can be imported to get or set the locale (`en-GB` <--> `nl-NL`)
- ✅ Automatically loads language namespace when locale is changed
- ❔ Read from HTML lang attribute _not sure if really needed? I don't think we need to provide HTML lang attribute as a way to setLocale/getLocale_
- ✅ Use a different lang attribute if third party tools are changing the HTML lang attribute to not conflict with e.g. Google Translate _we could do it ourselves with the `LIT_LOCALIZE_EVENT` and set this attribute to the html element_

## Namespaces

Grouping translations is important if we dynamically import translation files.
For example, if you import a component which has maybe 2 translated values and you're in `en-GB`,
you don't want to load the entire bundle of translations for the whole app for `en-GB`, only those in the component.

Therefore, we introduce the concept of namespaces, so we can group them and consequently, treeshake them for production.

Namespaces should allow for ease of use, making it easy to load, edit, add to, delete, etc.

- ❌ Group by namespaces and be able to load those. For example, `localize.createNamespace(namespace_id, { ... })` so that we can scope the amount of translation files bundled e.g. per UI component. _doesn't allow scoping per component level_
- ✅ Imperatively grab translated strings from namespaces, e.g. `localize.msg('lion-validate:error')` which might be needed to imperatively set `aria-label`s
- ❌ Allow imperatively adding data to namespaces + locale, `localize.addDataToNamespace(namespace_id, { ... })` _need to hook into lit translations resolution logic and probably need some data storage object to store calls to `addData()`_
- ❌ Override already defined namespaces by loading it with the same name, useful when needing to override translations completely for a component, without extending the component. Maybe require to pass `override: true` or something to make it more conscious override decision instead of accidental. _Might be possible if the previous two are possible, by adding an API for this on lion level_
- ❌ Edit namespace locales to import a different translation file `localize.editNamespaceForLocale(namespace_id, locale, import('./assets/custom-translations/en.js'));` _would be tricky even if we have the previous reqs, because we would need to hook into lit's logic on how translations are resolved_
- ❌ Edit namespace locales to import a different translation file but do so in a manner that reuses the original namespace, and just add to it. For example `localize.addToNamespaceForLocale(namespace_id, locale, import('./assets/custom-translations/en.js'));` which will act as a spread: `{ ...original, ...added }` _same as above_

## Translations

Translations are probably best grouped by locale. We may also consider that for deduplication purposes, we can create a language file `en.js` and extend it in the locale file `en-GB`, because even if there are dialect differences, it will be minor overrides with mostly similarities.

- ✅ Dynamically load local translations files
- ✅ Dynamically load third-party translations files over HTTP _does not support html template results in translations_
- ✅ Support HTML strings inside translations: `Welcome, <strong>Joe</strong>`
- ✅ Support base language with extension dialects, preferably through `.js` as the primary input files because it makes the extension process easy.
- ✅ (Optional) Start with `en.js` but transform it to XLIFF format to send to translation agencies to add translations. Then we receive it back and transform it back to `.js`
- ❔ Allow nesting translation keys `export const templates = { title: { h1: Hallo, Wereld! } }` and passing identifier as `namespace:title.h1` or similar _wouldn't be necessary if your translations are resolved by `msg()` based on sourceLocale's translated string_
- ❔ Pluralization & gender capable messages (ICU syntax), if using an external lib, only load it when translations contain ICU _@lit/localize plans to have their own API for ICU syntax for pluralization and gender capable messages so we probably don't have to do our own layer using MessageFormat_

```js
msg(html`Hello, World!`, 'title.h1');
```

## Component integration

We work mostly with Lit components, and quite often you will scope your translations to components using namespaces.
Therefore, a mixin around LitElement makes a lot of sense to control when the component needs to re-render (locale-change), etc. etc.

- ❌ Allow static method on component level that loads localization namespace + translations for the component
- ❌ Change the localize namespace for a single component **instance** `localize.changeNamespace(myButtonElement, namespaceObj)`
- ✅ Control whether render is deferred by loading translations/namespace, to prevent content flash / change _does not defer by default, but we could add this render deferrence quite easily in our Localize(d)Mixin_
- ✅ Allow locale changed hook method _can easily add it_
- ✅ Re-render after locale change (and if needed, wait for namespace load if it's a new locale)

## Bundling

- ✅ Supports a way to create locale-optimized bundles
