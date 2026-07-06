import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

export interface ViewportSignalsConfig {
  defaultRootMargin: string;
  defaultThreshold: number | number[];
}

export const DEFAULT_VIEWPORT_SIGNALS_CONFIG: ViewportSignalsConfig = {
  defaultRootMargin: '0px',
  defaultThreshold: 0,
};

export const VIEWPORT_SIGNALS_CONFIG = new InjectionToken<ViewportSignalsConfig>('VIEWPORT_SIGNALS_CONFIG', {
  factory: () => DEFAULT_VIEWPORT_SIGNALS_CONFIG,
});

export function provideViewportSignals(config?: Partial<ViewportSignalsConfig>): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: VIEWPORT_SIGNALS_CONFIG,
      useValue: { ...DEFAULT_VIEWPORT_SIGNALS_CONFIG, ...config },
    },
  ]);
}
