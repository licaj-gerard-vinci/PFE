import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rapport',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.scss'],
})
export class RapportComponent implements OnInit {
  rapportData: any = null; // Données du rapport
  isLoading: boolean = true; // Indicateur de chargement
  errorMessage: string | null = null; // Message d’erreur
  clientId: number | null = null; // ID du client dynamique

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Récupération dynamique du client ID depuis l'URL
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));

    if (this.clientId) {
      this.loadRapport();
    } else {
      this.errorMessage = 'ID client non spécifié.';
      this.isLoading = false;
    }
  }

  loadRapport(): void {
    this.http.get(`http://127.0.0.1:8000/report/${this.clientId}/`).subscribe(
      (data) => {
        this.rapportData = data;
        this.isLoading = false; // Fin du chargement
      },
      (error) => {
        console.error('Erreur lors du chargement du rapport :', error);
        this.errorMessage =
          error.status === 404
            ? 'Rapport introuvable.'
            : 'Erreur lors de la récupération des données.';
        this.isLoading = false; // Fin du chargement même en cas d’erreur
      }
    );
  }
}
