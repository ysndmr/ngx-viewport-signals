import { inject, Injector, Signal } from '@angular/core';
import { VIEWPORT_SIGNALS_CONFIG } from '../config/viewport.config';
import { ElementInput, ViewportSignalOptions } from '../types/viewport.types';
import { createElementObserverSignal } from '../utils/create-element-observer-signal';
import { resolveElement } from '../utils/element.utils';
import { withInjector } from '../utils/injection.utils';

const FINE_THRESHOLD_STEPS = Array.from({ length: 101 }, (_, i) => i / 100);

export function viewportRatio(
  elementInput: ElementInput,
  options: ViewportSignalOptions = {},
  injector?: Injector
): Signal<number> {
  return withInjector(injector, () => viewportRatioInternal(elementInput, options));
}

function viewportRatioInternal(elementInput: ElementInput, options: ViewportSignalOptions): Signal<number> {
  const config = inject(VIEWPORT_SIGNALS_CONFIG);

  return createElementObserverSignal(elementInput, 0, (setValue) =>
    new IntersectionObserver(([entry]) => setValue(entry.intersectionRatio), {
      root: resolveElement(options.root),
      rootMargin: options.rootMargin ?? config.defaultRootMargin,
      threshold: options.threshold ?? FINE_THRESHOLD_STEPS,
    })
  );
}
