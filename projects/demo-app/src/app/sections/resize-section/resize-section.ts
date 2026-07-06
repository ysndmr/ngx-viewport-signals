import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { elementSize } from 'ngx-viewport-signals';

@Component({
  selector: 'app-resize-section',
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resize-section.html',
  styleUrl: './resize-section.css',
})
export class ResizeSection {
  private readonly boxRef = viewChild.required<ElementRef<HTMLElement>>('box');

  protected readonly size = elementSize(() => this.boxRef().nativeElement);

  protected readonly codeSnippet = `<span class="tk-k">const</span> size = <span class="tk-f">elementSize</span>(<span class="tk-k">this</span>.boxRef);
<span class="tk-c">// size() -> { width, height }, updates on any box-size change</span>`;
}
