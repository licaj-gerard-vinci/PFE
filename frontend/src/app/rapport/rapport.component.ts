import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.scss']
})
export class RapportComponent implements OnInit {
  currentDate: Date = new Date();
  rapportData: any = {
    client: {
      nom_entreprise: 'Exemple Entreprise',
      prenom: 'Jean',
      nom: 'Dupont',
      fonction: 'Directeur',
      numero_tva: '123456789',
      adresse_siege_social: '123 Rue Exemple, Ville',
      code_nace_activite_principal: '1234',
      numero_certificat: 'CERT-12345',
      code_entite_certificatrice: 'ENT-123',
    },
    scores: {
      score_total: 85, // Exemple de score dynamique
    },
    domains: [
      { name: 'Environnemental' },
      { name: 'Social' },
      { name: 'Gouvernance' },
    ],
  };
  currentDomainIndex: number = 0;

  ngOnInit(): void {
    this.createGaugeChart();
  }

  createGaugeChart() {
    const ctx = document.getElementById('gaugeChart') as HTMLCanvasElement;
    const value = this.rapportData.scores.score_total; // Récupérer la valeur dynamique du score

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Insuffisant', 'Bon', 'Très bon', 'Excellent'],
        datasets: [{
          data: [25, 25, 25, 25],
          backgroundColor: ['#A6B1E1', '#88CCF1', '#B8E986', '#6ACD8D'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true,
        rotation: -90,
        circumference: 180,
        plugins: {
          tooltip: { enabled: false },
        },
      },
      plugins: [{
        id: 'needlePlugin',
        afterDatasetDraw(chart) {
          const { ctx, chartArea: { width, height }, data } = chart;
          const needleValue = value; // Position de l'aiguille
          const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
          const angle = Math.PI + (1 / total) * needleValue * Math.PI;

          const cx = width / 2;
          const cy = height;

          // Dessiner l'aiguille
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, -10);
          ctx.lineTo(height - 10, 0);
          ctx.lineTo(0, 10);
          ctx.fillStyle = '#FF5733'; // Couleur de l'aiguille
          ctx.fill();
          ctx.restore();

          // Ajout du point au centre
          ctx.beginPath();
          ctx.arc(cx, cy, 10, 0, Math.PI * 2);
          ctx.fillStyle = '#FF5733';
          ctx.fill();
        },
      }],
    });
  }

  getDateLimite(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 2);
    return date.toLocaleDateString('fr-FR');
  }

  getEngagementPeriod(): string {
    return 'd’ici 2 ans';
  }

  switchDomain(direction: string): void {
    if (direction === 'prev') {
      this.currentDomainIndex =
        (this.currentDomainIndex - 1 + this.rapportData.domains.length) % this.rapportData.domains.length;
    } else if (direction === 'next') {
      this.currentDomainIndex = (this.currentDomainIndex + 1) % this.rapportData.domains.length;
    }
  }
}
