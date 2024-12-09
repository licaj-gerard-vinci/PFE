import { Component, OnInit } from '@angular/core';
import { OnboardingService } from './onboarding.service';
import { FormsModule } from '@angular/forms'; // Importez FormsModule
import { Router } from '@angular/router'; // Importez Router
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
  currentPage: number = 0;
  pageSize: number = 5;
  formSubmitted: boolean = false;
  successMessage: string = '';


  constructor(private onboardingService: OnboardingService, private router: Router) {}


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

  isFormValid(): boolean {
    return this.paginatedQuestions.every(question => question.answer !== undefined && question.answer !== null && question.answer !== '');
  }

  get paginatedQuestions() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    return this.questions.slice(start, end);
  }

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.questions.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  submitForm(): void {
    const formattedDate = new Date().toISOString().split('T')[0];

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
      franchise: this.questions[11]?.answer,
      nombre_travailleurs: this.questions[12]?.answer || 0,
      litige_respect_loi_social_environnemental: this.questions[13]?.answer,
      honnete: this.questions[14]?.answer === 'true',
      soumission_demande_de_subside_pour_le_label: this.questions[15]?.answer,
      partenaire_introduction: this.questions[16]?.answer || '',
      ajouter_autre_chose: this.questions[17]?.answer,
      remarque_commentaire_precision: this.questions[18]?.answer || '',
      date_de_soumission: formattedDate
    };

    console.log('Form submitted', answers);
    this.onboardingService.submitAnswers(answers).subscribe(
      (response) => {
        
          this.formSubmitted = true;
          this.successMessage = 'Vous avez bien été enregistré(e)';
    
        console.log('Answers submitted successfully', response);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      (error) => {
        console.error('Error submitting answers', error);
      }
    );
  }
}