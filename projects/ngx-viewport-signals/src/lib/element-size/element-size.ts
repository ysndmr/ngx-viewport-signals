import { Injector, runInInjectionContext, signal, Signal } from '@angular/core';
import { ElementInput, ElementSize } from '../types/viewport.types';
import { toElementSignal } from '../utils/element.utils';
import { watchElementWithObserver } from '../utils/observer.utils';
import { isBrowserPlatform } from '../utils/platform.utils';

export function elementSize(elementInput: ElementInput, injector?: Injector): Signal<ElementSize> {
  return injector
    ? runInInjectionContext(injector, () => elementSizeInternal(elementInput))
    : elementSizeInternal(elementInput);
}

function elementSizeInternal(elementInput: ElementInput): Signal<ElementSize> {
  const size = signal<ElementSize>({ width: 0, height: 0 });
  if (!isBrowserPlatform()) {
    return size.asReadonly();
  }

  const elementSignal = toElementSignal(elementInput);

  watchElementWithObserver(
    elementSignal,
    () =>
      new ResizeObserver(([entry]) => {
        const box = entry.borderBoxSize?.[0];
        size.set(
          box
            ? { width: box.inlineSize, height: box.blockSize }
            : { width: entry.contentRect.width, height: entry.contentRect.height }
        );
      })
  );

  return size.asReadonly();
}
