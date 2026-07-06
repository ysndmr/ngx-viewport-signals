import { computed, ElementRef, isSignal, Signal, signal } from '@angular/core';
import { ElementInput } from '../types/viewport.types';

export function toElementSignal(input: ElementInput): Signal<Element | null> {
  if (input instanceof ElementRef) {
    return signal<Element | null>(input.nativeElement).asReadonly();
  }
  if (input instanceof Element) {
    return signal<Element | null>(input).asReadonly();
  }
  if (isSignal(input)) {
    return computed(() => input() ?? null);
  }
  return computed(() => input() ?? null);
}

export function resolveElementOnce(input: ElementInput | null | undefined): Element | null {
  if (input == null) return null;
  if (input instanceof ElementRef) return input.nativeElement;
  if (input instanceof Element) return input;
  if (isSignal(input)) return input() ?? null;
  return input() ?? null;
}
