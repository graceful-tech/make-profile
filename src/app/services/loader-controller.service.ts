// src/app/shared/loader-controller.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';

interface LoaderState {
  show: boolean;
  messages: string[];   // <-- typed as string[]
  interval: number;
}

@Injectable({ providedIn: 'root' })
export class LoaderControllerService {
  // typed BehaviorSubject so `messages` accepts string[]
  private loaderState = new BehaviorSubject<LoaderState>({
    show: false,
    messages: [],    // now correctly typed because BehaviorSubject is LoaderState
    interval: 3500
  });

  // public observable for consumers
  loaderState$ = this.loaderState.asObservable();

  // optional event when loader is hidden
  loaderHidden$ = new Subject<void>();

  showLoader(messages: string[], interval = 3500) {
    this.loaderState.next({
      show: true,
      messages,
      interval
    });
  }

  hideLoader() {
    this.loaderState.next({
      show: false,
      messages: [],
      interval: 3500
    });

    // emit hide event
    this.loaderHidden$.next();
  }

  // helper that returns an observable sequence of messages
  getRotation(messages: string[], intervalMs: number): Observable<string> {
    return timer(0, intervalMs).pipe(
      map(i => messages[Math.min(i, messages.length - 1)]),
      take(messages.length)
    );
  }
}
