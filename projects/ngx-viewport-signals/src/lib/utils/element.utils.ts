import { computed, ElementRef, Signal, signal } from '@angular/core';
import { ElementInput } from '../types/viewport.types';

/**
 * A Signal is itself a callable, so a Signal<Element | null | undefined> and a plain
 * `() => Element | null | undefined` accessor can be resolved the same way — no need
 * to special-case `isSignal()`.
 */
export function resolveElement(input: ElementInput | null | undefined): Element | null {
  if (input == null) return null;
  if (input instanceof ElementRef) return input.nativeElement;
  if (input instanceof Element) return input;
  return input() ?? null;
}

export function toElementSignal(input: ElementInput): Signal<Element | null> {
  if (input instanceof ElementRef || input instanceof Element) {
    return signal(resolveElement(input)).asReadonly();
  }
  return computed(() => resolveElement(input));
}
