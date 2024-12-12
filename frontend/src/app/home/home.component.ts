import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonsService } from '../services/buttons.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [CommonModule],
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  id_client: number = 0;
  est_termine: boolean = false;
  constructor(private router: Router, private buttonsService: ButtonsService) {}
  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {

        sessionStorage.setItem('token', tokenFromUrl);
    }
    this.buttonsService.getQuestionsUser().subscribe(
        (response) => {
            console.log('Utilisateur connecté (objet complet) :', response.client);
            this.est_termine = response.client.est_termine;
            this.id_client = response.client.id_client;
            console.log('ID_USER :', this.id_client);

            const token = sessionStorage.getItem('token');
            console.log('Utilisateur connecté :', {
                prenom: response.client.prenom,
                nom: response.client.nom,
                token: token
            });
        },
        (error) => {
            console.error('Utilisateur non connecté ou erreur :', error);

            alert('Vous devez être connecté pour accéder à ce formulaire.');
        }
    );
  }

  navigateToRapport() {
    this.router.navigate([`/rapport`]); // Navigue vers la page du rapport
  }

  navigateToFormulaire() {
    this.router.navigate(['/formulaire'], { queryParams: { id_client: this.id_client } });
  }
}