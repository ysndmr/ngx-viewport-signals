# ngx-viewport-signals

Signals-native IntersectionObserver & ResizeObserver primitives for Angular — SSR-safe, zero runtime dependencies.

**Live demo:** https://ysndmr.github.io/ngx-viewport-signals/
**Source:** https://github.com/ysndmr/ngx-viewport-signals

## Install

```bash
npm i ngx-viewport-signals
```

Supports Angular `17` through `21`.

## Use

```ts
import { ElementRef, inject } from '@angular/core';
import { inViewport, viewportRatio, elementSize, scrollProgress } from 'ngx-viewport-signals';

class MyComponent {
  private readonly el = inject(ElementRef);

  // true while the element intersects the viewport
  visible = inViewport(this.el, { threshold: 0.3, once: true });

  // continuous 0..1 intersection ratio
  ratio = viewportRatio(this.el);

  // { width, height }, updates on any box-size change
  size = elementSize(this.el);

  // continuous 0..1 scroll-through progress, driven by a gated rAF loop
  progress = scrollProgress(this.el);
}
```

All four accept an `ElementRef`, a raw `Element`, or an accessor function/signal — handy for elements
resolved via `document.querySelector` or a `viewChild()` query. On the server they never touch
`IntersectionObserver`/`ResizeObserver` — they just return a static default signal.

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

## License

MIT
