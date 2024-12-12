import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EngagementService } from '../services/engagement.service';

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

  constructor(private engagementService: EngagementService) {}

/*   ngOnInit(): void {
    const clientId = 1; // Exemple d'ID client

    this.engagementService.getEngagements(clientId).subscribe({
      next: (data) => {
        this.engagements = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des engagements :', err);
        this.loading = false;
      }
    });
  } */

    ngOnInit(): void {
      // Mock des engagements avec 9 entrées
      setTimeout(() => {
        this.engagements = [
          {
            id_engagement: 1,
            id_enjeu: 1,
            engagement: 'Améliorer la qualité de l\'air',
            commentaire: 'Réduction des émissions de CO2',
            kpis: '10% en moins',
            date: '2024-12-12'
          },
          {
            id_engagement: 2,
            id_enjeu: 2,
            engagement: 'Promouvoir l\'économie circulaire',
            commentaire: null,
            kpis: 'Augmentation du recyclage à 50%',
            date: '2024-12-25'
          },
          {
            id_engagement: 3,
            id_enjeu: 3,
            engagement: 'Réduire la consommation énergétique',
            commentaire: 'Optimisation des processus industriels',
            kpis: '15% en moins',
            date: '2024-11-20'
          },
          {
            id_engagement: 4,
            id_enjeu: 4,
            engagement: 'Encourager la mobilité douce',
            commentaire: 'Construction de pistes cyclables',
            kpis: null,
            date: '2025-01-15'
          },
          {
            id_engagement: 5,
            id_enjeu: 5,
            engagement: 'Réduction des déchets plastiques',
            commentaire: 'Partenariat avec des entreprises locales',
            kpis: '20% en moins',
            date: '2024-10-10'
          },
          {
            id_engagement: 6,
            id_enjeu: 6,
            engagement: 'Soutenir la biodiversité',
            commentaire: null,
            kpis: null,
            date: '2025-02-01'
          },
          {
            id_engagement: 7,
            id_enjeu: 7,
            engagement: 'Renforcer les formations écologiques',
            commentaire: 'Lancement d\'un programme éducatif',
            kpis: '100 personnes formées',
            date: '2024-09-30'
          },
          {
            id_engagement: 8,
            id_enjeu: 8,
            engagement: 'Investir dans les énergies renouvelables',
            commentaire: 'Installation de panneaux solaires',
            kpis: '30% d\'énergie renouvelable',
            date: '2025-03-10'
          },
          {
            id_engagement: 9,
            id_enjeu: 9,
            engagement: 'Favoriser le télétravail',
            commentaire: 'Réduction des trajets domicile-travail',
            kpis: null,
            date: '2024-08-20'
          }
        ];
        this.loading = false;
      }, 100); // Simule un délai pour afficher le spinner
    }

    
  
}
