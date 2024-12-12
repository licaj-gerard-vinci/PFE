import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormulaireComponent } from './buttons/buttons.component';
import { RapportComponent } from './rapport/rapport.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard, RedirectGuard } from './auth.guard';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AdminGuard } from './admin.guard';
import { ClientGuard } from './client.guard';
import { EngagementComponent} from './engagement/engagement.component';
import { VerificationComponent} from './verification/verification.component';

import { GlossairesComponent } from './glossaires/glossaires.component';
import { StandardsComponent } from './standards/standards.component';


export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [ClientGuard] }, // Route pour la page d'accueil
  { path: 'dashboard', component: DashboardComponent  }, // Route pour le tableau de bord
  { path: 'login', component: LoginComponent, canActivate: [RedirectGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [RedirectGuard] },
  { path: 'formulaire', component: FormulaireComponent},
  { path: 'onboarding', component: OnboardingComponent, canActivate: [RedirectGuard] }, // Route pour la page d'onboarding
  { path: 'rapport', component: RapportComponent, canActivate: [ClientGuard] }, // Route pour la page du rapport
  {path: 'engagement', component: EngagementComponent, canActivate : [ClientGuard]}, // Route pour la page d'engagement
  {path: 'verification', component: VerificationComponent}, // Route pour la page d'engagement
  { path: 'engagement', component: EngagementComponent, canActivate : [ClientGuard]}, // Route pour la page d'engagement
  { path: 'glossaires', component: GlossairesComponent}, // Route pour la page des glossaires
  { path: 'standards', component: StandardsComponent}, // Route pour la page des standards
  { path: '**', redirectTo: 'onboarding' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
