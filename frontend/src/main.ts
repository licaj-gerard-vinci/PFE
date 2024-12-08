import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog'; // Import Angular Material Dialog module
import { provideAnimations } from '@angular/platform-browser/animations'; // Ensure animations are available

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule, 
      AppRoutingModule,
      MatDialogModule 
    ),
    provideAnimations()
  ]
}).catch(err => console.error(err));