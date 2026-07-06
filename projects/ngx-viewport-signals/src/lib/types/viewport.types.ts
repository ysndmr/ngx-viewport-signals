import { ElementRef, Signal } from '@angular/core';

export type ElementInput =
  | ElementRef<Element>
  | Element
  | Signal<Element | null | undefined>
  | (() => Element | null | undefined);

export interface ViewportSignalOptions {
  root?: ElementInput | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export interface ScrollProgressOptions {
  clamp?: boolean;
}

export interface ElementSize {
  width: number;
  height: number;
}
