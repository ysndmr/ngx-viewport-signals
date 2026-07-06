import { ChangeDetectionStrategy, Component, computed, ElementRef, inject } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { viewportRatio } from 'ngx-viewport-signals';

const RING_RADIUS = 45;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

@Component({
  selector: 'app-progress-bar-section',
  imports: [PercentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './progress-bar-section.html',
  styleUrl: './progress-bar-section.css',
})
export class ProgressBarSection {
  private readonly panelRef = inject(ElementRef<HTMLElement>);
  protected readonly ratio = viewportRatio(this.panelRef);

  protected readonly ringCircumference = RING_CIRCUMFERENCE;
  protected readonly ringOffset = computed(() => RING_CIRCUMFERENCE * (1 - this.ratio()));
}
