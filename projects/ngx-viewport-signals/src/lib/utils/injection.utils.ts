import { Injector, runInInjectionContext } from '@angular/core';

export function withInjector<T>(injector: Injector | undefined, fn: () => T): T {
  return injector ? runInInjectionContext(injector, fn) : fn();
}
