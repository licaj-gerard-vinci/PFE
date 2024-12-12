import { Component, OnInit } from '@angular/core';
import { GlossairesService } from './glosaires.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-glossaires',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './glossaires.component.html',
  styleUrls: ['./glossaires.component.scss']
})
export class GlossairesComponent implements OnInit {
  glossaires: any[] = []; // Propriété pour stocker les données
  filteredGlossaires: any[] = []; // Propriété pour stocker les données filtrées
  searchQuery: string = ''; // Valeur du champ de recherche

  constructor(private glossaireService: GlossairesService) {}

  ngOnInit(): void {
    this.fetchGlossaires();
  }

  fetchGlossaires(): void {
    this.glossaireService.getGlossaires().subscribe(
      (data) => {
        this.glossaires = data;
        console.log('Données stockées :', this.glossaires);
        this.filteredGlossaires = [...this.glossaires];
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredGlossaires = this.glossaires.filter((glossaire) =>
      glossaire.nom.toLowerCase().includes(query) ||
      glossaire.definition.toLowerCase().includes(query)
    );
  }
}
