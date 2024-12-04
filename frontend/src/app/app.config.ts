import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { RouterModule } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), RouterModule]
};
