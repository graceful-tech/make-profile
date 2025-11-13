import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  Renderer2,
  NgZone,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appScrollFade]',
})
export class ScrollFadeDirectiveFade implements AfterViewInit, OnDestroy {
  @Input() animationDuration: number = 1000;
  @Input() animationDelay: number = 0;
  @Input() translateY: string = '40px';

  private scrollHandler!: () => void;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `translateY(${this.translateY})`
    );

    this.ngZone.runOutsideAngular(() => {
      this.scrollHandler = () => this.checkFade();

      window.addEventListener('scroll', this.scrollHandler, { passive: true });

      setTimeout(() => this.checkFade(), 200);
    });
  }

  private checkFade() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top <= windowHeight - 10 && rect.bottom >= 0) {
      setTimeout(() => {
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(
          this.el.nativeElement,
          'transform',
          'translateY(0)'
        );
      }, this.animationDelay);
    }
  }

  ngOnDestroy(): void {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
