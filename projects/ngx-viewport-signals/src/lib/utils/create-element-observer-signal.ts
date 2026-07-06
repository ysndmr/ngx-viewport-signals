import { signal, Signal } from '@angular/core';
import { ElementInput } from '../types/viewport.types';
import { toElementSignal } from './element.utils';
import { LifecycleObserver, watchElementWithObserver } from './observer.utils';
import { isBrowserPlatform } from './platform.utils';

/**
 * Shared skeleton behind inViewport()/viewportRatio()/elementSize(): SSR guard, resolve the
 * element (static or reactive), create one observer per element, tear it down on destroy.
 * scrollProgress() doesn't fit this shape (it drives an rAF loop, not a single observer
 * callback) so it stays bespoke.
 */
export function createElementObserverSignal<TValue, TObserver extends LifecycleObserver>(
  elementInput: ElementInput,
  initial: TValue,
  createObserver: (setValue: (value: TValue) => void) => TObserver
): Signal<TValue> {
  const value = signal(initial);
  if (!isBrowserPlatform()) {
    return value.asReadonly();
  }

  const elementSignal = toElementSignal(elementInput);
  watchElementWithObserver(elementSignal, () => createObserver((v) => value.set(v)));

  return value.asReadonly();
}
