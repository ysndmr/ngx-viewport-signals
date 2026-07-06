import { ChangeDetectionStrategy, Component, ElementRef, inject, input } from '@angular/core';
import { inViewport } from 'ngx-viewport-signals';

@Component({
  selector: 'app-reveal-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="reveal-card"
      [class.reveal-card--visible]="visible()"
      [style.transition-delay.ms]="index() * 70"
    >
      <span class="reveal-card__index">{{ index() < 10 ? '0' + index() : index() }}</span>
      <h3>{{ label() }}</h3>
      <p>{{ description() }}</p>
    </div>
  `,
  styleUrl: './reveal-card.css',
})
export class RevealCard {
  readonly index = input.required<number>();
  readonly label = input.required<string>();
  readonly description = input.required<string>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  protected readonly visible = inViewport(this.elementRef, { threshold: 0.3, once: true });
}
