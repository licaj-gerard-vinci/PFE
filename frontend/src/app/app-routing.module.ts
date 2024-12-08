import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormulaireQ } from './formulaire/formulaire.component';


const routes: Routes = [
  { path: 'formulaire', component: FormulaireQ },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'formulaire', pathMatch: 'full' },
  { path: '**', redirectTo: 'formulaire' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }