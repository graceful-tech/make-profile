import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// ===== GLOBAL window.confirm OVERRIDE =====
(function overrideConfirm() {
  interface Window {
    originalConfirm?: (message?: string) => boolean;
  }

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    console.warn('Safari detected — overriding window.confirm');

    // Save original confirm
    window.originalConfirm = window.confirm;

    // Override confirm globally
    window.confirm = function (message?: string): boolean {
      console.warn('Safari fallback confirm dialog');

      if (!message) {
        message = '';
      }

      const result = window.prompt(`${message} (yes/no)`, 'yes');
      return result?.toLowerCase() === 'yes';
    };
  }
})();

platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
