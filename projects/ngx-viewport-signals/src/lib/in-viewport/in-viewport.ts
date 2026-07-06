import { inject, Injector, Signal } from '@angular/core';
import { VIEWPORT_SIGNALS_CONFIG } from '../config/viewport.config';
import { ElementInput, ViewportSignalOptions } from '../types/viewport.types';
import { createElementObserverSignal } from '../utils/create-element-observer-signal';
import { resolveElement } from '../utils/element.utils';
import { withInjector } from '../utils/injection.utils';

export function inViewport(
  elementInput: ElementInput,
  options: ViewportSignalOptions = {},
  injector?: Injector
): Signal<boolean> {
  return withInjector(injector, () => inViewportInternal(elementInput, options));
}

function inViewportInternal(elementInput: ElementInput, options: ViewportSignalOptions): Signal<boolean> {
  const config = inject(VIEWPORT_SIGNALS_CONFIG);

  return createElementObserverSignal(elementInput, false, (setValue) =>
    new IntersectionObserver(
      ([entry], observer) => {
        setValue(entry.isIntersecting);
        // once the reveal has fired, there's nothing left to observe — disconnect
        // rather than leaving a live IntersectionObserver around for the page's lifetime
        if (options.once && entry.isIntersecting) observer.disconnect();
      },
      {
        root: resolveElement(options.root),
        rootMargin: options.rootMargin ?? config.defaultRootMargin,
        threshold: options.threshold ?? config.defaultThreshold,
      }
    )
  );
}
