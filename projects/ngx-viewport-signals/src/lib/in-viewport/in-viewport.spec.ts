import { Injector, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { inViewport } from './in-viewport';
import { FakeIntersectionObserver, installFakeObservers } from '../testing/observer-mocks.spec-utils';
import { configureViewportTestBed } from '../testing/test-bed.spec-utils';

const flushEffects = () => TestBed.tick();

describe('inViewport', () => {
  beforeEach(() => {
    installFakeObservers();
    configureViewportTestBed();
  });

  it('does not throw and returns false by default on the server platform', async () => {
    configureViewportTestBed([{ provide: PLATFORM_ID, useValue: 'server' }]);
    const el = document.createElement('div');

    const visible = TestBed.runInInjectionContext(() => inViewport(el));
    await flushEffects();

    expect(visible()).toBe(false);
    expect(FakeIntersectionObserver.instances.length).toBe(0);
  });

  it('observes the element and updates the signal on intersection change', async () => {
    const el = document.createElement('div');

    const visible = TestBed.runInInjectionContext(() => inViewport(el));
    await flushEffects();

    expect(visible()).toBe(false);
    const observer = FakeIntersectionObserver.instances[0];
    expect(observer.observed).toContain(el);

    observer.trigger({ target: el, isIntersecting: true });
    expect(visible()).toBe(true);

    observer.trigger({ target: el, isIntersecting: false });
    expect(visible()).toBe(false);
  });

  it('freezes the value and disconnects the observer after the first intersection when once is true', async () => {
    const el = document.createElement('div');

    const visible = TestBed.runInInjectionContext(() => inViewport(el, { once: true }));
    await flushEffects();

    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger({ target: el, isIntersecting: true });
    expect(visible()).toBe(true);
    expect(observer.disconnected).toBe(true);

    observer.trigger({ target: el, isIntersecting: false });
    expect(visible()).toBe(true);
  });

  it('keeps observing (does not disconnect) while once is true but not yet intersecting', async () => {
    const el = document.createElement('div');

    const visible = TestBed.runInInjectionContext(() => inViewport(el, { once: true }));
    await flushEffects();

    const observer = FakeIntersectionObserver.instances[0];
    observer.trigger({ target: el, isIntersecting: false });
    expect(visible()).toBe(false);
    expect(observer.disconnected).toBe(false);
  });

  it('disconnects the observer when the injector is destroyed', async () => {
    const el = document.createElement('div');
    const childInjector = Injector.create({ providers: [], parent: TestBed.inject(Injector) });

    const visible = inViewport(el, {}, childInjector);
    await flushEffects();

    const observer = FakeIntersectionObserver.instances[0];
    expect(observer.disconnected).toBe(false);

    childInjector.destroy();

    expect(observer.disconnected).toBe(true);
    expect(visible()).toBe(false);
  });
});
