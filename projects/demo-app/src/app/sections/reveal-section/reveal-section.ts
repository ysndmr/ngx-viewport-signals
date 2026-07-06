import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealCard } from './reveal-card';

interface RevealFeature {
  label: string;
  description: string;
}

@Component({
  selector: 'app-reveal-section',
  imports: [RevealCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reveal-section.html',
})
export class RevealSection {
  protected readonly features: RevealFeature[] = [
    {
      label: 'Reveal on scroll, one line',
      description: 'inViewport(el, { once: true }) replaces the observer/cleanup boilerplate shown above.',
    },
    {
      label: 'SSR-safe by default',
      description: 'On the server it never touches IntersectionObserver — it just returns a static signal.',
    },
    {
      label: 'Zero runtime dependencies',
      description: 'No RxJS operators, no utility libs. Nothing extra to audit in your bundle.',
    },
    {
      label: 'Signals-native',
      description: "Feed the result straight into computed() or effect() like any other signal.",
    },
    {
      label: 'Works with any Element',
      description: 'Pass an ElementRef, a raw Element, or an accessor function — your choice.',
    },
    {
      label: 'Automatic cleanup',
      description: 'Teardown happens via DestroyRef — no ngOnDestroy boilerplate to remember.',
    },
  ];
}
