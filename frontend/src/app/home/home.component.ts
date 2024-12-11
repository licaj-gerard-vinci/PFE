import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToRapport() {
    this.router.navigate([`/rapport`]); // Navigue vers la page du rapport
  }

  navigateToFormulaire() {
    this.router.navigate(['/formulaire']); // Navigue vers la page formulaire
  }

}