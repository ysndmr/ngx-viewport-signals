import { Injector, Signal } from '@angular/core';
import { ElementInput, ElementSize } from '../types/viewport.types';
import { createElementObserverSignal } from '../utils/create-element-observer-signal';
import { withInjector } from '../utils/injection.utils';

export function elementSize(elementInput: ElementInput, injector?: Injector): Signal<ElementSize> {
  return withInjector(injector, () => elementSizeInternal(elementInput));
}

function elementSizeInternal(elementInput: ElementInput): Signal<ElementSize> {
  return createElementObserverSignal(elementInput, { width: 0, height: 0 }, (setValue) =>
    new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      setValue(
        box
          ? { width: box.inlineSize, height: box.blockSize }
          : { width: entry.contentRect.width, height: entry.contentRect.height }
      );
    })
  );
}
