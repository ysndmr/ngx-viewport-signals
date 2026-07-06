export class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  readonly observed: Element[] = [];
  disconnected = false;

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit
  ) {
    FakeIntersectionObserver.instances.push(this);
  }

  observe(el: Element): void {
    this.observed.push(el);
  }

  unobserve(el: Element): void {
    const i = this.observed.indexOf(el);
    if (i >= 0) this.observed.splice(i, 1);
  }

  disconnect(): void {
    this.disconnected = true;
  }

  trigger(entry: Partial<IntersectionObserverEntry> & { target: Element }): void {
    if (this.disconnected) return;
    this.callback([entry as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

export class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];

  readonly observed: Element[] = [];
  disconnected = false;

  constructor(private readonly callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this);
  }

  observe(el: Element): void {
    this.observed.push(el);
  }

  unobserve(el: Element): void {
    const i = this.observed.indexOf(el);
    if (i >= 0) this.observed.splice(i, 1);
  }

  disconnect(): void {
    this.disconnected = true;
  }

  trigger(entry: Partial<ResizeObserverEntry> & { target: Element }): void {
    if (this.disconnected) return;
    this.callback([entry as ResizeObserverEntry], this as unknown as ResizeObserver);
  }
}

export function installFakeObservers(): void {
  FakeIntersectionObserver.instances = [];
  FakeResizeObserver.instances = [];
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeIntersectionObserver;
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = FakeResizeObserver;
}
