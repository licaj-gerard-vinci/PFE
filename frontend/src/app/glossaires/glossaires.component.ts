import { Component, OnInit } from '@angular/core';
import { GlossairesService } from './glosaires.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glossaires',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './glossaires.component.html',
  styleUrls: ['./glossaires.component.scss']
})
export class GlossairesComponent implements OnInit {
  glossaires: any[] = []; // Propriété pour stocker les données

  constructor(private glossaireService: GlossairesService) {}

  ngOnInit(): void {
    this.fetchGlossaires();
  }

  fetchGlossaires(): void {
    this.glossaireService.getGlossaires().subscribe(
      (data) => {
        this.glossaires = data;
        console.log('Données stockées :', this.glossaires);
        
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }
}
