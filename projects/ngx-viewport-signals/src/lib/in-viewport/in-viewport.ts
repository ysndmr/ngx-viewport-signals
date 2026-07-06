import { inject, Injector, runInInjectionContext, signal, Signal } from '@angular/core';
import { VIEWPORT_SIGNALS_CONFIG } from '../config/viewport.config';
import { ElementInput, ViewportSignalOptions } from '../types/viewport.types';
import { resolveElementOnce, toElementSignal } from '../utils/element.utils';
import { watchElementWithObserver } from '../utils/observer.utils';
import { isBrowserPlatform } from '../utils/platform.utils';

export function inViewport(
  elementInput: ElementInput,
  options: ViewportSignalOptions = {},
  injector?: Injector
): Signal<boolean> {
  return injector
    ? runInInjectionContext(injector, () => inViewportInternal(elementInput, options))
    : inViewportInternal(elementInput, options);
}

function inViewportInternal(elementInput: ElementInput, options: ViewportSignalOptions): Signal<boolean> {
  const isVisible = signal(false);
  if (!isBrowserPlatform()) {
    return isVisible.asReadonly();
  }

  const config = inject(VIEWPORT_SIGNALS_CONFIG);
  const elementSignal = toElementSignal(elementInput);
  let settled = false;

  watchElementWithObserver(
    elementSignal,
    () =>
      new IntersectionObserver(
        ([entry]) => {
          if (settled && options.once) return;
          isVisible.set(entry.isIntersecting);
          if (options.once && entry.isIntersecting) settled = true;
        },
        {
          root: resolveElementOnce(options.root),
          rootMargin: options.rootMargin ?? config.defaultRootMargin,
          threshold: options.threshold ?? config.defaultThreshold,
        }
      )
  );

  return isVisible.asReadonly();
}
