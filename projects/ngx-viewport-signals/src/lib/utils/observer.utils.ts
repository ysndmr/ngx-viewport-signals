import { effect, Signal } from '@angular/core';

export interface LifecycleObserver {
  observe(el: Element): void;
  unobserve(el: Element): void;
  disconnect(): void;
}

/**
 * effect()'s onCleanup runs both before the next re-run (element changed) and on
 * injector destruction — a single hook covers both teardown cases, no separate
 * DestroyRef wiring needed.
 */
export function watchElementWithObserver<TObserver extends LifecycleObserver>(
  elementSignal: Signal<Element | null>,
  createObserver: () => TObserver
): void {
  effect((onCleanup) => {
    const el = elementSignal();
    if (!el) return;

    const observer = createObserver();
    observer.observe(el);

    onCleanup(() => {
      observer.unobserve(el);
      observer.disconnect();
    });
  });
}
