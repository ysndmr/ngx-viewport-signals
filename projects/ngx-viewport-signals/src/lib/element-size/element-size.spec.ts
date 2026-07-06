import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { elementSize } from './element-size';
import { FakeResizeObserver, installFakeObservers } from '../testing/observer-mocks.spec-utils';
import { configureViewportTestBed } from '../testing/test-bed.spec-utils';

const flushEffects = () => TestBed.tick();

describe('elementSize', () => {
  beforeEach(() => {
    installFakeObservers();
    configureViewportTestBed();
  });

  it('does not throw and returns zero size by default on the server platform', async () => {
    configureViewportTestBed([{ provide: PLATFORM_ID, useValue: 'server' }]);
    const el = document.createElement('div');

    const size = TestBed.runInInjectionContext(() => elementSize(el));
    await flushEffects();

    expect(size()).toEqual({ width: 0, height: 0 });
    expect(FakeResizeObserver.instances.length).toBe(0);
  });

  it('reads width/height from borderBoxSize when available', async () => {
    const el = document.createElement('div');

    const size = TestBed.runInInjectionContext(() => elementSize(el));
    await flushEffects();

    const observer = FakeResizeObserver.instances[0];
    observer.trigger({
      target: el,
      borderBoxSize: [{ inlineSize: 320, blockSize: 200 }] as unknown as ResizeObserverEntry['borderBoxSize'],
      contentRect: { width: 300, height: 180 } as DOMRectReadOnly,
    });

    expect(size()).toEqual({ width: 320, height: 200 });
  });

  it('falls back to contentRect when borderBoxSize is unavailable', async () => {
    const el = document.createElement('div');

    const size = TestBed.runInInjectionContext(() => elementSize(el));
    await flushEffects();

    const observer = FakeResizeObserver.instances[0];
    observer.trigger({ target: el, contentRect: { width: 150, height: 90 } as DOMRectReadOnly });

    expect(size()).toEqual({ width: 150, height: 90 });
  });
});
