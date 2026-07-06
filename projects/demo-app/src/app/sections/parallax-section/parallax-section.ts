import { ChangeDetectionStrategy, Component, computed, ElementRef, inject } from '@angular/core';
import { scrollProgress } from 'ngx-viewport-signals';

interface Particle {
  left: string;
  size: string;
  speed: number;
}

@Component({
  selector: 'app-parallax-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './parallax-section.html',
  styleUrl: './parallax-section.css',
})
export class ParallaxSection {
  private readonly sectionRef = inject(ElementRef<HTMLElement>);
  protected readonly progress = scrollProgress(this.sectionRef);

  protected readonly particles: Particle[] = [
    { left: '8%', size: '10px', speed: 320 },
    { left: '20%', size: '6px', speed: 180 },
    { left: '35%', size: '14px', speed: 260 },
    { left: '58%', size: '8px', speed: 400 },
    { left: '72%', size: '12px', speed: 220 },
    { left: '88%', size: '7px', speed: 340 },
  ];

  protected readonly backTransform = computed(() => `translateY(${(1 - this.progress()) * 60}px) rotate(${(1 - this.progress()) * -4}deg)`);
  protected readonly midTransform = computed(() => `translateY(${(1 - this.progress()) * 140}px)`);
  protected readonly frontTransform = computed(
    () => `translateY(${(1 - this.progress()) * 240}px) scale(${0.9 + this.progress() * 0.1})`
  );

  protected particleTransform(speed: number): string {
    return `translateY(${(1 - this.progress()) * speed}px)`;
  }

  protected readonly codeSnippet = `<span class="tk-k">const</span> progress = <span class="tk-f">scrollProgress</span>(<span class="tk-k">this</span>.sectionRef);
<span class="tk-k">const</span> y = <span class="tk-f">computed</span>(() =&gt; <span class="tk-s">\`translateY(\${(1 - progress()) * 140}px)\`</span>);`;
}
