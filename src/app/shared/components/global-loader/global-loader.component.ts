import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderControllerService } from 'src/app/services/loader-controller.service';

@Component({
  selector: 'app-global-loader',
  standalone: false,
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.css'
})
export class GlobalLoaderComponent {

  show = false;
  caption = 'Please wait…';

  private msgSub?: Subscription;

  constructor(private loaderService: LoaderControllerService) {
    this.loaderService.loaderState$.subscribe(state => {
      this.show = state.show;
      if (state.show) {
        this.startRotation(state.messages, state.interval);
      } else {
        this.stopRotation();
      }
    });
  }

  startRotation(messages: string[], interval: number) {
    this.stopRotation();

    this.msgSub = this.loaderService.getRotation(messages, interval)
      .subscribe({
        next: msg => this.caption = msg,
        complete: () => { }
      });
  }

  stopRotation() {
    this.msgSub?.unsubscribe();
  }

  ngOnDestroy() {
    this.msgSub?.unsubscribe();
  }
}
