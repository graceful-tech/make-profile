import { Directive, ElementRef, Input, AfterViewInit, Renderer2, NgZone } from '@angular/core';

@Directive({
  selector: '[appScrollAnimatesection1]'
})
export class ScrollAnimateDirectiveSection1 implements AfterViewInit {
  @Input() animationName: string = 'flipInX';
  @Input() animationDuration: number = 1000; // ms
  @Input() animationDelay: number = 0; // ms

  constructor(private el: ElementRef, private renderer: Renderer2, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    // Initial styles
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform');

    this.ngZone.runOutsideAngular(() => {
      const handleScroll = () => {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        if (rect.top <= windowHeight - 50 && rect.bottom >= 0) {
          // In viewport → trigger animation
          this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
          this.renderer.setStyle(
            this.el.nativeElement,
            'animation',
            `${this.animationName} ${this.animationDuration}ms ease forwards`
          );
          this.renderer.setStyle(this.el.nativeElement, 'animation-delay', `${this.animationDelay}ms`);
        } else {
          // Out of viewport → reset for next scroll
          this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
          this.renderer.setStyle(this.el.nativeElement, 'animation', 'none');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // trigger on load
    });
  }
}
