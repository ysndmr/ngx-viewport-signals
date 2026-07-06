import { DestroyRef, inject, Injector, runInInjectionContext, signal, Signal } from '@angular/core';
import { ElementInput, ScrollProgressOptions } from '../types/viewport.types';
import { toElementSignal } from '../utils/element.utils';
import { watchElementWithObserver } from '../utils/observer.utils';
import { isBrowserPlatform } from '../utils/platform.utils';

export function scrollProgress(
  elementInput: ElementInput,
  options: ScrollProgressOptions = {},
  injector?: Injector
): Signal<number> {
  return injector
    ? runInInjectionContext(injector, () => scrollProgressInternal(elementInput, options))
    : scrollProgressInternal(elementInput, options);
}

function scrollProgressInternal(elementInput: ElementInput, options: ScrollProgressOptions): Signal<number> {
  const progress = signal(0);
  if (!isBrowserPlatform()) {
    return progress.asReadonly();
  }

  const clamp = options.clamp ?? true;
  const elementSignal = toElementSignal(elementInput);
  const destroyRef = inject(DestroyRef);

  let rafId: number | null = null;
  let active = false;

  const measure = (el: Element) => {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height + vh;
    const traveled = vh - rect.top;
    let value = total > 0 ? traveled / total : 0;
    if (clamp) value = Math.min(1, Math.max(0, value));
    progress.set(value);
  };

  const tick = (el: Element) => {
    if (!active) return;
    measure(el);
    rafId = requestAnimationFrame(() => tick(el));
  };

  watchElementWithObserver(
    elementSignal,
    () =>
      new IntersectionObserver(
        ([entry]) => {
          active = entry.isIntersecting;
          if (active && rafId === null) {
            tick(entry.target);
          } else if (!active && rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        },
        { threshold: 0, rootMargin: '0px' }
      )
  );

  destroyRef.onDestroy(() => {
    if (rafId !== null) cancelAnimationFrame(rafId);
  });

  return progress.asReadonly();
}
