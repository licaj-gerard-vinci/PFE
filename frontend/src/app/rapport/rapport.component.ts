import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RapportService } from '../rapport.service';
import { Chart, ChartOptions, registerables } from 'chart.js';
import { AuthService } from '../auth.service';

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
  chart: any; // Instance du graphique global
  domainChart: any; // Instance pour le graphique des domaines (E, S, G)
  radarChart: any; // Instance pour le graphique radar

  currentDomainIndex: number = 0; // Index du domaine actuellement affiché
  currentDate: Date = new Date(); // Date actuelle

  constructor(private rapportService: RapportService, private authService: AuthService) {
    Chart.register(...registerables); // Enregistrement de Chart.js
  }

  ngOnInit(): void {
    this.loadRapport();
  }

  loadRapport(): void {
    this.rapportService.getRapport().subscribe(
      (data: any) => {
        if (data && data.client) { // Validation des données reçues
          console.log('Données reçues :', data); // Debug
          this.rapportData = data;
          this.isLoading = false;
          this.renderChartScoreTotal();
          this.renderEngagementChart(); 
          this.renderDomainSwitchChart();
          this.renderCircularChart();
        } else {
          this.errorMessage = 'Données invalides reçues du serveur.';
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des données :', error);
        this.errorMessage = 'Erreur lors de la récupération des données.';
        this.isLoading = false;
      }
    );
  }

  // Rendu du graphique global (score ESG total)
  renderChartScoreTotal(): void {
    setTimeout(() => {
      const canvas = document.getElementById('gaugeChart') as HTMLCanvasElement;

      if (!canvas) {
        console.error('Canvas introuvable pour le graphique global.');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Contexte de canvas introuvable pour le graphique global.');
        return;
      }

      const score = this.rapportData?.scores?.score_total || 0;
      const segments = [
        { label: 'Insuffisant', color: '#A6B1E1', range: [0, 25] },
        { label: 'Bon', color: '#88CCF1', range: [25, 50] },
        { label: 'Très bon', color: '#B8E986', range: [50, 75] },
        { label: 'Excellent', color: '#6ACD8D', range: [75, 100] },
      ];

      const data = {
        labels: segments.map((seg) => seg.label),
        datasets: [
          {
            data: segments.map((seg) => seg.range[1] - seg.range[0]),
            backgroundColor: segments.map((seg) => seg.color),
            borderWidth: 0,
          },
        ],
      };

      const options: ChartOptions<'doughnut'> = {
        maintainAspectRatio: false,
        cutout: '70%',
        rotation: 180,
        circumference: 270,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false
           },
        },
      };

      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data,
        options,
      });
    }, 100);
  }

  // Rendu du graphique des engagements ESG
  renderEngagementChart(): void {
    setTimeout(() => {
      const canvas = document.getElementById('engagementChart') as HTMLCanvasElement;

      if (!canvas) {
        console.error('Canvas introuvable pour le graphique des engagements.');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Contexte de canvas introuvable pour le graphique des engagements.');
        return;
      }

      const scoreActuel = this.rapportData?.scores?.score_actuel || 0;
      const scoreEngagement = this.rapportData?.scores?.score_engagement || 0;
      const remainingScore = 100 - scoreActuel - scoreEngagement;

      const data = {
        labels: ['Score ESG actuel', 'Score d’engagement'],
        datasets: [
          {
            data: [scoreActuel, scoreEngagement, remainingScore],
            backgroundColor: ['#88CCF1', '#B8E986', '#0e403d'],
            borderWidth: 0,
          },
        ],
      };

      const options: ChartOptions<'doughnut'> = {
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              },
            },
          },
        },
      };

      new Chart(ctx, {
        type: 'doughnut',
        data,
        options,
      });
    }, 100);
  }

  // Méthode pour changer le domaine affiché (E, S, G)
  switchDomain(direction: string): void {
    const domainCount = this.rapportData?.domains?.length || 0;
    if (direction === 'next') {
      this.currentDomainIndex = (this.currentDomainIndex + 1) % domainCount;
    } else if (direction === 'prev') {
      this.currentDomainIndex = (this.currentDomainIndex - 1 + domainCount) % domainCount;
    }
    this.renderDomainSwitchChart();
  }

  // Rendu du graphique par domaine
  renderDomainSwitchChart(): void {
    setTimeout(() => {
      const canvas = document.getElementById('domainSwitchChart') as HTMLCanvasElement;

      if (!canvas) {
        console.error('Canvas introuvable pour le graphique par domaine.');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Contexte de canvas introuvable pour le graphique par domaine.');
        return;
      }

      const domainData = this.rapportData?.domains[this.currentDomainIndex];

      if (!domainData) {
        console.error('Données du domaine introuvables.');
        return;
      }

      const scoreActuel = domainData.score_actuel || 0;
      const scoreEngagement = domainData.score_engagement || 0;
      const remainingScore = 100 - scoreActuel - scoreEngagement;

      const data = {
        labels: ['Score actuel', 'Score d’engagement'],
        datasets: [
          {
            data: [scoreActuel, scoreEngagement, remainingScore],
            backgroundColor: ['#B8E986', '#88CCF1', '#2a8f88'],
            borderWidth: 0,
          },
        ],
      };

      const options: ChartOptions<'doughnut'> = {
        cutout: '70%',
        plugins: {
          legend: { display: false },
        },
      };

      /*if (this.domainChart) {
        this.domainChart.destroy();
      }*/

      this.domainChart = new Chart(ctx, {
        type: 'doughnut',
        data,
        options,
      });
    }, 100);
  }

  getEngagementPeriod(): string {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + 2); // Ajout de 2 ans
  
    // Formatage en "Mois Année" (ex: "Décembre 2024")
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    const formattedStartDate = startDate.toLocaleDateString('fr-FR', options);
    const formattedEndDate = endDate.toLocaleDateString('fr-FR', options);
  
    return `${formattedStartDate} - ${formattedEndDate}`;
  }
  
  renderCircularChart(): void {
    setTimeout(() => {
      const canvas = document.getElementById('circularChart') as HTMLCanvasElement;
  
      if (!canvas) {
        console.error('Canvas introuvable pour le graphique circulaire.');
        return;
      }
  
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Contexte de canvas introuvable pour le graphique circulaire.');
        return;
      }
  
      const labels = [
        'Environnemental - Score Actuel',
        'Environnemental - Score Engagement',
        'Social - Score Actuel',
        'Social - Score Engagement',
        'Gouvernance - Score Actuel',
        'Gouvernance - Score Engagement',
      ];
  
      const scores = [
        this.rapportData?.domains[0]?.score_actuel || 0, // Environnemental - Actuel
        this.rapportData?.domains[0]?.score_engagement || 0, // Environnemental - Engagement
        this.rapportData?.domains[1]?.score_actuel || 0, // Social - Actuel
        this.rapportData?.domains[1]?.score_engagement || 0, // Social - Engagement
        this.rapportData?.domains[2]?.score_actuel || 0, // Gouvernance - Actuel
        this.rapportData?.domains[2]?.score_engagement || 0, // Gouvernance - Engagement
      ];
  
      const colors = [
        '#88CCF1', // Bleu clair pour Environnemental - Actuel
        '#B8E986', // Vert clair pour Environnemental - Engagement
        '#FFDD57', // Jaune pour Social - Actuel
        '#FFD1DC', // Rose clair pour Social - Engagement
        '#6ACD8D', // Vert foncé pour Gouvernance - Actuel
        '#D4A5A5', // Beige foncé pour Gouvernance - Engagement
      ];
  
      const data = {
        labels,
        datasets: [
          {
            data: scores,
            backgroundColor: colors,
            borderWidth: 1,
          },
        ],
      };
  
      const options = {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              },
            },
          },
        },
        cutout: '5%', // Épaisseur de l'anneau
        responsive: true,
        maintainAspectRatio: false,
      };
  
      this.chart = new Chart(ctx, {
        type: 'doughnut',
        data,
        options,
      });
    }, 100);
  }

  getDateLimite(): string {
    const currentDate = new Date();
    const dateLimite = new Date();
    dateLimite.setFullYear(currentDate.getFullYear() + 2); // Add 2 years to today's date
  
    // Format the date to "dd/MM/yyyy"
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return dateLimite.toLocaleDateString('fr-FR', options);
  }
  
  
  

}
