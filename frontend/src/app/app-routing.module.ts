import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RapportComponent } from './rapport/rapport.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AdminGuard } from './admin.guard';
import { ClientGuard } from './client.guard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [ClientGuard] }, // Route pour la page d'accueil
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'report/:clientId', component: RapportComponent, canActivate: [ClientGuard]},
  { path: '**', redirectTo: 'onboarding' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }