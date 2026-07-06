import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ParallaxSection } from './sections/parallax-section/parallax-section';
import { ProgressBarSection } from './sections/progress-bar-section/progress-bar-section';
import { ResizeSection } from './sections/resize-section/resize-section';
import { RevealSection } from './sections/reveal-section/reveal-section';

@Component({
  selector: 'app-root',
  imports: [RevealSection, ProgressBarSection, ResizeSection, ParallaxSection],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly beforeCode = `<span class="tk-k">class</span> <span class="tk-t">MyComponent</span> {
  <span class="tk-k">private</span> observer?: <span class="tk-t">IntersectionObserver</span>;
  visible = <span class="tk-f">signal</span>(<span class="tk-k">false</span>);

  <span class="tk-f">ngAfterViewInit</span>() {
    <span class="tk-k">if</span> (<span class="tk-k">typeof</span> <span class="tk-t">IntersectionObserver</span> === <span class="tk-s">'undefined'</span>) <span class="tk-k">return</span>;
    <span class="tk-k">this</span>.observer = <span class="tk-k">new</span> <span class="tk-t">IntersectionObserver</span>(([e]) => {
      <span class="tk-k">this</span>.visible.<span class="tk-f">set</span>(e.isIntersecting);
    });
    <span class="tk-k">this</span>.observer.<span class="tk-f">observe</span>(<span class="tk-k">this</span>.el.nativeElement);
  }

  <span class="tk-f">ngOnDestroy</span>() {
    <span class="tk-k">this</span>.observer?.<span class="tk-f">disconnect</span>();
  }
}`;

  protected readonly afterCode = `<span class="tk-k">class</span> <span class="tk-t">MyComponent</span> {
  <span class="tk-k">private</span> el = <span class="tk-f">inject</span>(<span class="tk-t">ElementRef</span>);
  visible = <span class="tk-f">inViewport</span>(<span class="tk-k">this</span>.el);
}`;
}
