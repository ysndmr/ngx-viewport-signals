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

## License

MIT
