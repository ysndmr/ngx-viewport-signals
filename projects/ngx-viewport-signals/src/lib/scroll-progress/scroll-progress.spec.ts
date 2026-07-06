import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { scrollProgress } from './scroll-progress';
import { FakeIntersectionObserver, installFakeObservers } from '../testing/observer-mocks.spec-utils';
import { configureViewportTestBed } from '../testing/test-bed.spec-utils';

const flushEffects = () => TestBed.tick();

describe('scrollProgress', () => {
  beforeEach(() => {
    installFakeObservers();
    configureViewportTestBed();
  });

  it('does not throw and returns 0 by default on the server platform', async () => {
    configureViewportTestBed([{ provide: PLATFORM_ID, useValue: 'server' }]);
    const el = document.createElement('div');

    const progress = TestBed.runInInjectionContext(() => scrollProgress(el));
    await flushEffects();

    expect(progress()).toBe(0);
    expect(FakeIntersectionObserver.instances.length).toBe(0);
  });

  it('starts measuring via rAF once the element intersects, and stops when it exits', async () => {
    const el = document.createElement('div');
    spyOn(el, 'getBoundingClientRect').and.returnValue({
      top: 400,
      height: 300,
    } as DOMRect);
    spyOnProperty(window, 'innerHeight').and.returnValue(800);

    let rafCallback: FrameRequestCallback | null = null;
    spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
      rafCallback = cb;
      return 1;
    });
    spyOn(window, 'cancelAnimationFrame');

    const progress = TestBed.runInInjectionContext(() => scrollProgress(el));
    await flushEffects();

    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger({ target: el, isIntersecting: true });

    // total = 300 + 800 = 1100, traveled = 800 - 400 = 400 => 400/1100
    expect(progress()).toBeCloseTo(400 / 1100, 5);
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    observer.trigger({ target: el, isIntersecting: false });
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('clamps the value to [0, 1] by default', async () => {
    const el = document.createElement('div');
    spyOn(el, 'getBoundingClientRect').and.returnValue({ top: -9999, height: 300 } as DOMRect);
    spyOnProperty(window, 'innerHeight').and.returnValue(800);
    spyOn(window, 'requestAnimationFrame').and.callFake(() => 1);

    const progress = TestBed.runInInjectionContext(() => scrollProgress(el));
    await flushEffects();

    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger({ target: el, isIntersecting: true });

    expect(progress()).toBe(1);
  });
});
