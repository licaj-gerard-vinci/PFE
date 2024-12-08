import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rapport',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.scss'],
})
export class RapportComponent implements OnInit {
  rapportData: any = null; // Les données du rapport récupérées depuis le backend
  isLoading: boolean = true; // Indicateur de chargement
  errorMessage: string | null = null; // Gestion des erreurs

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRapport();
  }

  loadRapport(): void {
    const clientId = 1; // Dynamique : ID du client connecté (remplacez par un token si besoin)
    this.http.get(`http://127.0.0.1:8000/report/${clientId}/`).subscribe(
      (data) => {
        this.rapportData = data;
        this.isLoading = false; // Fin du chargement
      },
      (error) => {
        console.error('Erreur lors du chargement du rapport :', error);
        this.errorMessage = 'Impossible de charger le rapport.';
        this.isLoading = false; // Fin du chargement même en cas d’erreur
      }
    );
  }
}
