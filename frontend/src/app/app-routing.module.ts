import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormulaireQ } from './formulaire/formulaire.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormulaireComponent } from './buttons/buttons.component';
import { RapportComponent } from './rapport/rapport.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AdminGuard } from './admin.guard';
import { ClientGuard } from './client.guard';


export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [ClientGuard] }, // Route pour la page d'accueil
  { path: 'dashboard', component: DashboardComponent /*, canActivate: [AdminGuard]*/ }, // Route pour le tableau de bord
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'formulaire', component: FormulaireComponent},
  { path: 'report/:clientId', component: RapportComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'login' },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'rapport', component: RapportComponent, canActivate: [ClientGuard] }, // Route pour la page du rapport
  { path: '**', redirectTo: 'onboarding' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }