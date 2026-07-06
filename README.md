# ngx-viewport-signals

Signals-native IntersectionObserver & ResizeObserver primitives for Angular — SSR-safe, zero runtime dependencies.

Most reveal-on-scroll or resize-tracking code in Angular apps is the same fifteen lines of
`ngAfterViewInit`/`ngOnDestroy` boilerplate copy-pasted between components. `ngx-viewport-signals`
collapses that into a single function call that returns a real `Signal`.

- **Signals-native** — `inViewport()`, `viewportRatio()`, `elementSize()`, `scrollProgress()` all return
  a real `Signal<T>`, ready to feed into `computed()` or `effect()`
- **SSR-safe** — guarded by `PLATFORM_ID`, never touches `IntersectionObserver`/`ResizeObserver` on the server
- **Zero dependencies** — `@angular/core` and `@angular/common` as peers, nothing else
- **Works with any element** — pass an `ElementRef`, a raw `Element`, or an accessor function/signal
- **Automatic cleanup** — teardown happens via `DestroyRef`, no `ngOnDestroy` to remember

## Install

```bash
npm i ngx-viewport-signals
```

Supports Angular `17`, `18`, `19`, and `20`.

## Use

```ts
import { ElementRef, inject } from '@angular/core';
import { inViewport, viewportRatio, elementSize, scrollProgress } from 'ngx-viewport-signals';

class MyComponent {
  private readonly el = inject(ElementRef);

  visible = inViewport(this.el, { threshold: 0.3, once: true }); // Signal<boolean>
  ratio = viewportRatio(this.el);                                // Signal<number>, 0..1
  size = elementSize(this.el);                                   // Signal<{ width, height }>
  progress = scrollProgress(this.el);                            // Signal<number>, 0..1
}
```

## Configure (optional)

```ts
import { ApplicationConfig } from '@angular/core';
import { provideViewportSignals } from 'ngx-viewport-signals';

export const appConfig: ApplicationConfig = {
  providers: [
    provideViewportSignals({ defaultRootMargin: '0px', defaultThreshold: 0 })
  ]
};
```

`provideViewportSignals()` is optional — every primitive works with zero setup.

## Demo

**Live:** https://ysndmr.github.io/ngx-viewport-signals/

`projects/demo-app` exercises all four primitives on one scrollable page: staggered reveal-on-scroll
cards, a live intersection-ratio ring + bar, a drag-resizable box tracked by `elementSize()`, and a
GSAP-free parallax section driven entirely by `scrollProgress()`.

```bash
npm install
npm run build:lib
npm start
```

`npm start` serves `demo-app`; the library must be built first since the app imports
`ngx-viewport-signals` from its built output (`dist/ngx-viewport-signals`), not the source directly —
standard Angular library-workspace convention.

## Publishing (maintainer)

1. Log in to npm once, locally:

   ```bash
   npm login
   ```

2. Build the library — this also strips `tslib` from the published `dependencies` (ng-packagr adds it
   back on every build; `scripts/patch-lib-package.mjs` removes it) so the zero-dependency badge stays
   honest:

   ```bash
   npm run build:lib
   ```

3. Dry-run the publish before it's live:

   ```bash
   cd dist/ngx-viewport-signals
   npm publish --dry-run
   ```

4. If the file list and `package.json` look right, publish for real:

   ```bash
   npm publish --access public
   ```

CI (`.github/workflows/publish.yml`) does this automatically on every push to `main`: it builds the
library and the demo app, deploys the demo to GitHub Pages, and publishes to npm if an `NPM_TOKEN`
secret is configured on the repository (`Settings → Secrets and variables → Actions`). No token, no
publish step — the Pages deploy still runs.

## License

MIT
