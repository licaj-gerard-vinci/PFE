import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Pour l'appel à l'API
import { CommonModule } from '@angular/common'; // Pour utiliser le pipe lowercase
import { FormsModule } from '@angular/forms'; // Pour utiliser ngModel
import { StandardsService } from './standards.service';

@Component({
  selector: 'app-standards',
  standalone: true, // Indique que ce composant est autonome
  imports: [CommonModule, FormsModule], // Ajouter FormsModule ici
  templateUrl: './standards.component.html',
  styleUrls: ['./standards.component.scss']
})
export class StandardsComponent implements OnInit {
  standards: any[] = []; // Liste complète des standards
  filteredStandards: any[] = []; // Liste filtrée pour l'affichage
  searchQuery: string = ''; // Valeur du champ de recherche

  constructor(private standardsService: StandardsService) {} // Injection du service HttpClient

  ngOnInit(): void {
    this.fetchStandards();
  }

  fetchStandards(): void {
    this.standardsService.getStandards().subscribe(
      (data) => {
        this.standards = data;
        this.filteredStandards = [...this.standards]; // Initialisation de la liste filtrée
      },
      (error) => {
        console.error('Erreur lors de la récupération des standards :', error);
      }
    );
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredStandards = this.standards.filter((standard) =>
      standard.nom.toLowerCase().includes(query) ||
      standard.presentation.toLowerCase().includes(query) ||
      standard.plus_info.toLowerCase().includes(query)
    );
  }
}
