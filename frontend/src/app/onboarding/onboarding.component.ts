import { Component, OnInit } from '@angular/core';
import { OnboardingService } from './onboarding.service';
import { FormsModule } from '@angular/forms'; // Importez FormsModule
import { CommonModule } from '@angular/common'; // Importez CommonModule

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule] // Ajoutez CommonModule et FormsModule ici
})
export class OnboardingComponent implements OnInit {
  questions: any[] = [];
  prenom: string = '';
  nom: string = '';
  adresse_mail: string = '';
  fonction: string = '';
  nom_entreprise: string = '';
  numero_tva: string = '';
  forme_juridique: string = '';
  adresse_siege_social: string = '';
  adresse_site_web: string = '';
  code_nace_activite_principal: string = '';
  chiffre_affaire_du_dernier_exercice_fiscal: number = 0;
  franchise: boolean = false;
  nombre_travailleurs: number = 0;
  litige_respect_loi_social_environnemental: boolean = false;
  honnete: boolean = false;
  soumission_demande_de_subside_pour_le_label: boolean = false;
  partenaire_introduction: string = '';
  ajouter_autre_chose: boolean = false;
  remarque_commentaire_precision: string = '';
  date_de_soumission: Date = new Date();

  constructor(private onboardingService: OnboardingService) {}

  ngOnInit(): void {
    this.onboardingService.getQuestions().subscribe(
      (data) => {
        console.log('Questions fetched', data);
        this.questions = data;
      },
      (error) => {
        console.error('Error fetching questions', error);
      }
    );
  }

  submitForm(): void {
    const formattedDate = this.date_de_soumission.toISOString().split('T')[0];

    const answers = {
      prenom: this.questions[0]?.answer || '',
      nom: this.questions[1]?.answer || '',
      adresse_mail: this.questions[2]?.answer || '',
      fonction: this.questions[3]?.answer || '',
      nom_entreprise: this.questions[4]?.answer || '',
      numero_tva: this.questions[5]?.answer || '',
      forme_juridique: this.questions[6]?.answer || '',
      adresse_siege_social: this.questions[7]?.answer || '',
      adresse_site_web: this.questions[8]?.answer || '',
      code_nace_activite_principal: this.questions[9]?.answer || '',
      chiffre_affaire_du_dernier_exercice_fiscal: this.questions[10]?.answer || 0,
      franchise: this.questions[11]?.answer === 'true',
      nombre_travailleurs: this.questions[12]?.answer || 0,
      litige_respect_loi_social_environnemental: this.questions[13]?.answer === 'true',
      honnete: this.questions[14]?.answer === 'true',
      soumission_demande_de_subside_pour_le_label: this.questions[15]?.answer === 'true',
      partenaire_introduction: this.questions[16]?.answer || '',
      ajouter_autre_chose: this.questions[17]?.answer === 'true',
      remarque_commentaire_precision: this.questions[18]?.answer || '',
      date_de_soumission: formattedDate
    };

    console.log('Form submitted', answers);
    this.onboardingService.submitAnswers(answers).subscribe(
      (response) => {
        console.log('Answers submitted successfully', response);
      },
      (error) => {
        console.error('Error submitting answers', error);
      }
    );
  }
}