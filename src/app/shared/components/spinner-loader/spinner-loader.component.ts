import { Component, Input } from '@angular/core';

type Variant = 'glass' | 'neon' | 'infinity' | 'line' | 'bubble' | 'spinner';

@Component({
  selector: 'app-spinner-loader',
  standalone: false,
  templateUrl: './spinner-loader.component.html',
  styleUrl: './spinner-loader.component.css'
})
export class SpinnerLoaderComponent {
 /** show/hide overlay */
  @Input() show: boolean = false;

  
  @Input() variant: Variant = 'glass';

  /** primary color (hex / css) */
  @Input() color: string = '#3b82f6';

  /** secondary color used by some variants */
  @Input() secondary: string = '#06b6d4';

  /** size in px (number or string) */
  @Input() size: number | string = 80;

  /** width for line/infinity variants (number|string) */
  @Input() width: number | string = 140;

  /** optional caption text under loader */
  @Input() caption?: string;

 
    toNumber(v: number | string | undefined, fallback = 0) {
    if (v === undefined || v === null) return fallback;
    return typeof v === 'number' ? v : (isNaN(parseInt(v as string, 10)) ? fallback : parseInt(v as string, 10));
  }

  get sizePx() { return `${this.toNumber(this.size, 80)}px`; }
  get widthPx() { return `${this.toNumber(this.width, 140)}px`; }
}
