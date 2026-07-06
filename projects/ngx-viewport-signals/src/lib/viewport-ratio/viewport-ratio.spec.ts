import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { viewportRatio } from './viewport-ratio';
import { FakeIntersectionObserver, installFakeObservers } from '../testing/observer-mocks.spec-utils';
import { configureViewportTestBed } from '../testing/test-bed.spec-utils';

const flushEffects = () => TestBed.tick();

describe('viewportRatio', () => {
  beforeEach(() => {
    installFakeObservers();
    configureViewportTestBed();
  });

  it('does not throw and returns 0 by default on the server platform', async () => {
    configureViewportTestBed([{ provide: PLATFORM_ID, useValue: 'server' }]);
    const el = document.createElement('div');

    const ratio = TestBed.runInInjectionContext(() => viewportRatio(el));
    await flushEffects();

    expect(ratio()).toBe(0);
    expect(FakeIntersectionObserver.instances.length).toBe(0);
  });

  it('tracks intersectionRatio updates', async () => {
    const el = document.createElement('div');

    const ratio = TestBed.runInInjectionContext(() => viewportRatio(el));
    await flushEffects();

    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger({ target: el, intersectionRatio: 0.42 });
    expect(ratio()).toBeCloseTo(0.42);

    observer.trigger({ target: el, intersectionRatio: 1 });
    expect(ratio()).toBe(1);
  });

  it('defaults to a fine-grained threshold ladder when none is provided', async () => {
    const el = document.createElement('div');

    TestBed.runInInjectionContext(() => viewportRatio(el));
    await flushEffects();

    const observer = FakeIntersectionObserver.instances[0];
    expect(Array.isArray(observer.options?.threshold)).toBe(true);
    expect((observer.options?.threshold as number[]).length).toBeGreaterThan(50);
  });
});
