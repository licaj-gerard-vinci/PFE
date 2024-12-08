import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionsService } from './formulaire.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss'],
})
export class FormulaireQ {
  activeTab: 'aujourdhui' | 'engagement' = 'aujourdhui'; // Onglet actif
  currentQuestionIndex = 0; // Index de la question actuelle
  questions: any[] = []; // Liste des questions avec leurs réponses

  // Stockage des réponses sélectionnées pour chaque onglet
  responses = {
    aujourdhui: null as string | null, // Réponse pour aujourd'hui
    engagement: null as string | null, // Réponse pour dans 2 ans
  };

  selectedCheckboxes: string[] = []; // Stocke les réponses sélectionnées pour les checkbox

  constructor(private formulaireService: QuestionsService) {}

  ngOnInit(): void {
    this.loadQuestions(); // Charger les questions au démarrage
  }

  // Charger les questions depuis le backend
  loadQuestions(): void {
    this.formulaireService.getQuestionsReponse().subscribe(
      (response) => {
        console.log('Données brutes reçues :', response); // Vérifiez si les doublons viennent du backend
  
        this.questions = response.map((q: any, index: number) => ({
          id: q.id_question, // ID de la question
          type: q.type, // Type de la question ('radio', 'checkbox', 'libre')
          number: `Q${index + 1}`, // Numéro de la question
          text: q.sujet, // Texte de la question
          reponses: q.reponses.map((r: any) => ({
            id: r.id_reponse, // ID de la réponse
            text: r.texte, // Texte de la réponse
            score: r.score_individuelle, // Score associé
            champLibre: r.champ_libre, // Si champ libre
          })),
        }));
        console.log('Questions transformées :', this.questions);
      },
      (error) => {
        console.error('Erreur lors du chargement des questions :', error);
      }
    );
  }

  // Récupérer la question actuelle
  get currentQuestion() {
    return this.questions[this.currentQuestionIndex] || null;
  }

  // Passer à la question suivante
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.resetResponses(); // Réinitialiser les réponses
    }
  }

  // Revenir à la question précédente
  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.resetResponses(); // Réinitialiser les réponses
    }
  }

  // Changer d'onglet
  switchTab(tab: 'aujourdhui' | 'engagement'): void {
    this.activeTab = tab;
  }

  // Réinitialiser les réponses pour les deux onglets
  resetResponses(): void {
    this.responses.aujourdhui = null;
    this.responses.engagement = null;
    this.selectedCheckboxes = []; // Réinitialiser les checkbox sélectionnées
  }

  // Capturer la réponse sélectionnée pour les types 'radio' et 'libre'
  onReponseSelected(reponse: { id: number; text: string }): void {
    if (this.activeTab === 'aujourdhui') {
      this.responses.aujourdhui = reponse.text; // Stocker la réponse pour aujourd'hui
    } else if (this.activeTab === 'engagement') {
      this.responses.engagement = reponse.text; // Stocker la réponse pour dans 2 ans
    }
  }

  // Gérer les changements pour les checkbox
  onCheckboxChange(event: Event, reponse: { id: number; text: string }): void {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      this.selectedCheckboxes.push(reponse.text); // Ajouter la réponse si elle est cochée
    } else {
      this.selectedCheckboxes = this.selectedCheckboxes.filter(
        (r) => r !== reponse.text
      ); // Supprimer si décochée
    }

    // Mettre à jour les réponses en fonction de l'onglet actif
    if (this.activeTab === 'aujourdhui') {
      this.responses.aujourdhui = this.selectedCheckboxes.join(', '); // Concaténer les réponses
    } else if (this.activeTab === 'engagement') {
      this.responses.engagement = this.selectedCheckboxes.join(', ');
    }
  }

  // Confirmer les réponses pour les deux onglets
  confirmAnswer(): void {
    if (!this.currentQuestion) {
      console.warn('Aucune question sélectionnée.');
      return;
    }

    const reponseUtilisateur = {
      id_client: 1, // ID client par défaut
      id_question: this.currentQuestion.id, // ID de la question
      id_reponse:
        this.currentQuestion.type === 'radio' || this.currentQuestion.type === 'checkbox'
          ? this.currentQuestion.reponses.find(
              (r: any) => r.text === this.responses.aujourdhui
            )?.id
          : null, // Pour les radio/checkbox
      commentaire:
        this.currentQuestion.type === 'libre' ? this.responses.aujourdhui : null, // Réponse en texte libre
      rep_aujourd_hui: this.responses.aujourdhui || null,
      rep_dans_2_ans: this.responses.engagement || null,
      score_final: 0, // Score final par défaut
      sa_reponse:
        this.currentQuestion.type === 'radio' || this.currentQuestion.type === 'checkbox'
          ? this.currentQuestion.reponses.find(
              (r: any) => r.text === this.responses.aujourdhui
            )?.id
          : null, // ID réponse pour radio/checkbox
      id_engagement: null, // ID engagement par défaut
    };

    console.log('Données envoyées :', reponseUtilisateur);

    this.formulaireService.saveReponseClient(reponseUtilisateur).subscribe(
      (response) => {
        console.log('Réponses sauvegardées avec succès', response);
        this.nextQuestion();
      },
      (error) => {
        console.error('Erreur lors de la sauvegarde des réponses :', error);
      }
    );
  }
}
