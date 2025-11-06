import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  Renderer2,
  NgZone
} from '@angular/core';

@Directive({
  selector: '[appScrollFade]'
})
export class ScrollFadeDirectiveFade implements AfterViewInit {
  @Input() animationDuration: number = 1000; // ms
  @Input() animationDelay: number = 0; // ms
  @Input() translateY: string = '40px'; // how far to slide

  constructor(private el: ElementRef, private renderer: Renderer2, private ngZone: NgZone) {}

 


  ngAfterViewInit(): void {
    // initial styles
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(this.el.nativeElement, 'transform', `translateY(${this.translateY})`);
    this.renderer.setStyle(this.el.nativeElement, 'transition', `
      opacity ${this.animationDuration}ms ease,
      transform ${this.animationDuration}ms ease
    `);
    this.renderer.setStyle(this.el.nativeElement, 'will-change', 'opacity, transform');

    this.ngZone.runOutsideAngular(() => {
      const handleScroll = () => {
        const rect = this.el.nativeElement.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        if (rect.top <= windowHeight - 10 && rect.bottom >= 0) {
          // in view → fade + slide in
          setTimeout(() => {
            this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
          }, this.animationDelay);
        } else {
          // out of view → reset for next scroll
          this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
          this.renderer.setStyle(this.el.nativeElement, 'transform', `translateY(${this.translateY})`);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // initial check
    });
  }
}
