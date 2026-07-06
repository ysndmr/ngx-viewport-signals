import { inject, Injector, runInInjectionContext, signal, Signal } from '@angular/core';
import { VIEWPORT_SIGNALS_CONFIG } from '../config/viewport.config';
import { ElementInput, ViewportSignalOptions } from '../types/viewport.types';
import { resolveElementOnce, toElementSignal } from '../utils/element.utils';
import { watchElementWithObserver } from '../utils/observer.utils';
import { isBrowserPlatform } from '../utils/platform.utils';

const FINE_THRESHOLD_STEPS = Array.from({ length: 101 }, (_, i) => i / 100);

export function viewportRatio(
  elementInput: ElementInput,
  options: ViewportSignalOptions = {},
  injector?: Injector
): Signal<number> {
  return injector
    ? runInInjectionContext(injector, () => viewportRatioInternal(elementInput, options))
    : viewportRatioInternal(elementInput, options);
}

function viewportRatioInternal(elementInput: ElementInput, options: ViewportSignalOptions): Signal<number> {
  const ratio = signal(0);
  if (!isBrowserPlatform()) {
    return ratio.asReadonly();
  }

  const config = inject(VIEWPORT_SIGNALS_CONFIG);
  const elementSignal = toElementSignal(elementInput);

  watchElementWithObserver(
    elementSignal,
    () =>
      new IntersectionObserver(([entry]) => ratio.set(entry.intersectionRatio), {
        root: resolveElementOnce(options.root),
        rootMargin: options.rootMargin ?? config.defaultRootMargin,
        threshold: options.threshold ?? FINE_THRESHOLD_STEPS,
      })
  );

  return ratio.asReadonly();
}
