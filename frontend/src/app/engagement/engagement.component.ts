import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EngagementService } from '../services/engagement.service';
import { RapportService } from '../rapport.service'; // Import du RapportService

@Component({
  selector: 'app-engagement',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.scss']
})
export class EngagementComponent implements OnInit {
  engagements: any[] = [];
  loading: boolean = true;
  rapportData: any = {
    client: {
      nom_entreprise: '',
      prenom: '',
      nom: '',
      fonction: '',
    },
  };
  currentDate: Date = new Date(); // Date actuelle

  constructor(
    private engagementService: EngagementService,
    private rapportService: RapportService // Injection du RapportService
  ) {}

  ngOnInit(): void {
    this.loadRapportData(); // Charger les données du pacte
    this.loadEngagements(); // Charger la liste des engagements
  }

  // Charger les données du Pacte d'Engagement via RapportService
  loadRapportData(): void {
    this.rapportService.getRapport().subscribe({
      next: (data: any) => {
        if (data && data.client) {
          console.log('Données du Pacte d’Engagement :', data);
          this.rapportData = data;
        } else {
          console.error('Données du Pacte invalides reçues.');
        }
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des données du Pacte :', err);
      }
    });
  }

  // Charger la liste des engagements via EngagementService
  loadEngagements(): void {
    const id_client = 1; // Exemple d'ID client
    this.engagementService.getEngagements(id_client).subscribe({
      next: (data: any) => {
        this.engagements = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des engagements :', err);
        this.loading = false;
      }
    });
  }

  // Calculer la période des engagements dynamiquement
  getEngagementPeriod(): string {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 2); // Ajouter 2 ans

    // Format "Mois Année"
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    const formattedStartDate = startDate.toLocaleDateString('fr-FR', options);
    const formattedEndDate = endDate.toLocaleDateString('fr-FR', options);

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  // Obtenir la date limite des engagements
  getDateLimite(): string {
    const dateLimite = new Date(this.currentDate);
    dateLimite.setFullYear(dateLimite.getFullYear() + 2); // Ajouter 2 ans
    return dateLimite.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}
