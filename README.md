# @lit/localize investigation

## Demo

To see demo:

```
npm i && npm start
```

This will show a deferred render until translation is fetched from a json with a 1 second delay.

Go into `index.js` to turn `deferRenderingUntilLocaleLoaded` to false to make it not defer.
You can also switch to fetching translation from locale module instead (un)commenting `loadLocale` lines in `index.js`

## Pros & Challenges

| Pro                                                                                     | Challenges                                                              |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Works easily, easy API, singletonious                                                   | Does not have a straightforward way to scope translations by components |
| HTML strings in translations                                                            | Does not have hooks into translations resolution allowing for overrides |
| XLIFF integration for translation tools                                                 |                                                                         |
| Good integration with lit-element and lit-html                                          |                                                                         |
| CLI tools for extracting/building XLIFF <-> JS                                          |                                                                         |
| Works easily, easy API, singletonious                                                   |                                                                         |
| "Just works" with third party translations although not with lit-sanitized HTML strings |                                                                         |
| Optimize for production by bundling different JS entrypoints per locale                 |                                                                         |

## Conclusion

Investigate with the maintainers (Alexander Marks & Justin Fagnani from the looks of it) whether we can overcome those challenges, because given the pros it really seems worth using.

Most of our very specific requirements we can add on our end, like deferring rendering, adding hooks for translations/locale events.

For scoping translations by components (or arbitrarily namespacing translations? instead of only possible inside `Localize(d)Mixin`), we'll need to change `@lit/localize`'s implementation a bit I think.

Proposed API could be:

`packages/button/src/LionButton.js`:

```js
class LionButton extends Localized(LitElement) {
  static get localizeNamespaces() {
    return {
      namespace: 'lion-button',
      sourceLocale: 'en-GB',
      targetLocales: ['nl-NL', 'de-DE'],
      loadLocale: (locale) => import(`../../translations/${locale}.js`),
    };
  }
}
```

For doing component / namespace specific overriding we will need a hook into `@lit/localize`'s resolution logic so we can add / change stuff. Examples being adding arbitrary translations, merging translation files from author / user, doing full overrides or nesting translation keys and allowing identifiers to be dot-separated `export const templates = { title: { h1: 'Foo' }}` => `title.h1`.
