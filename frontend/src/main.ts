import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { CommonModule } from '@angular/common';
import { routes } from './app/app-routing.module';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      BrowserModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule, 
      AppRoutingModule,
      CommonModule
    )
  ]
}).catch(err => console.error(err));