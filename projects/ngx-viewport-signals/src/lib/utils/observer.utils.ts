import { DestroyRef, effect, inject, Signal } from '@angular/core';

interface LifecycleObserver {
  observe(el: Element): void;
  unobserve(el: Element): void;
  disconnect(): void;
}

export function watchElementWithObserver<TObserver extends LifecycleObserver>(
  elementSignal: Signal<Element | null>,
  createObserver: () => TObserver
): void {
  const destroyRef = inject(DestroyRef);
  let observer: TObserver | null = null;
  let observedEl: Element | null = null;

  const cleanup = () => {
    if (observer && observedEl) observer.unobserve(observedEl);
    observer?.disconnect();
    observer = null;
    observedEl = null;
  };

  effect(() => {
    const el = elementSignal();
    cleanup();
    if (!el) return;
    observer = createObserver();
    observer.observe(el);
    observedEl = el;
  });

  destroyRef.onDestroy(cleanup);
}
