import { Component, OnInit } from '@angular/core';
import { ButtonsService } from '../services/buttons.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-try',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './buttons.component.html',
    styleUrls: ['./buttons.component.scss'],
  })
  export class Formulaire implements OnInit{
    activeTab: 'aujourdhui' | 'engagement' = 'aujourdhui';
    currentQuestionIndex = 0;
    enjeux: any[] = [];
    questions: any[] = [];
    questions2 : any[] = [];
    clientReponses: any[] = [];
    sortedQuestions: any[] = [];
    sortedEnjeux: any[] = [];
    selectedEnjeuId: number | null = null;
    selectedQuestionId: number | null = null;
    id_client: number = 1;
    hasAllQuestions : any[] = [];
    Responses: any[] = [];
    showModal: boolean = false;
    showInfo: boolean = false;
    showInfo2: boolean = false;
    clientsTemplates: any[] = [];
    champLibreAujourdhui: string = '';
    champLibreEngagement: string = '';
    selectedCheckboxeAujourdhui: { id: number; text: string }[] = [];
    selectedCheckboxeEngagement: { id: number; text: string }[] = [];
    showCommentField: boolean = false;
    comment: string = '';
    champLibre: string = '';
    constructor(private buttonsService: ButtonsService) {}

    toggleCommentField(): void {

      if(this.showCommentField == false){
        this.showCommentField = true;
      }else{
        this.showCommentField = false; 
      }

    }

    onCommentInput(event: Event): void {
      this.comment = (event.target as HTMLTextAreaElement).value; // Met à jour manuellement
      console.log('Valeur actuelle du commentaire :', this.comment);
    }

    onChampInput(event: Event): void {
      const value = (event.target as HTMLTextAreaElement).value;
      if (this.activeTab === 'aujourdhui') {
        this.champLibreAujourdhui = value;
        console.log('Valeur pour Aujourdhui :', this.champLibreAujourdhui);
      } else if (this.activeTab === 'engagement') {
        this.champLibreEngagement = value;
        console.log('Valeur pour Engagement :', this.champLibreEngagement);
      }
    }


    ngOnInit(): void {
        this.getEnjeux();
        this.getQuestions();
        this.getClientResponses();
        this.loadQuestions();
        this.getTemplates();
    }

    getEnjeux() {
        this.buttonsService.getEnjeux().subscribe(
            (response) =>  {
                this.enjeux = response;
                console.log(this.enjeux);
                this.sortEnjeux();
            },
            (error) => {
                console.log(error)
            }
        )
    }
    getQuestions() {
        this.buttonsService.getQuestions().subscribe(
            (response) => {
                this.questions = response;
                console.log(this.questions);
            },
            (error) => {
                console.log(error)
            }
        )
    }
    getTemplates() {
        this.buttonsService.getTemplatesClient(this.id_client).subscribe(
          (response) => {
            this.clientsTemplates = response;
            console.log(this.clientsTemplates);
          },
          (error) => {
            console.log(error)
          }
        )
    }
    getClientResponses(): Promise<void> {
        console.log(this.id_client)
        return new Promise ((resolve, reject) => {
            this.buttonsService.getClientResponses(this.id_client).subscribe(
            (response) => {
                this.clientReponses = response;
                console.log(this.clientReponses)
                this.getReelReponses();
                resolve()
            },
            (error) => {
                console.log(error)
                reject(error);
            }
        )
        });
    }
    sortQuestions(_id_enjeu: any): void {
        if (this.selectedEnjeuId === _id_enjeu){
            this.sortedQuestions = [];
            this.selectedEnjeuId = null;
        } else {
            this.selectedEnjeuId = _id_enjeu;
            this.sortedQuestions = [];
            this.questions.forEach(question => {
                const enjeu = this.getEnjeuByid(question.id_enjeu);
                if ((question.id_enjeu === _id_enjeu || enjeu.enjeu_parent === _id_enjeu)){
                    this.sortedQuestions.push(question)
                }
            })
        }
    }
    getEnjeuByid(_id_enjeu: number): any {
        return this.enjeux.find(enjeu => enjeu.id_enjeu === _id_enjeu);
    }


    sortEnjeux(){
        this.enjeux.forEach(enjeu => {
            if (enjeu.enjeu_parent === null){
                this.sortedEnjeux.push(enjeu);
            }
        })
    }
    checkTemplatesReponses(reponse:any): boolean{
      console.log(reponse)
      if (reponse.id_template === 1){
        return true;
      }
      if (this.clientsTemplates.find(response1 => response1.id_template === reponse.id_template)){
        return true;
      }
      return false;
    }
    selectQuestion(questionId: number): void {
        this.selectedQuestionId = questionId;
        this.getGoodQuestion(questionId);
        console.log(this.currentQuestionIndex);
    }
    getResponseById(_id_reponse : number): any {
        this.buttonsService.getReponse(_id_reponse).subscribe(
            (response) => {
                this.Responses.push(response);
                console.log(this.Responses)
            },
            (error) => {
                console.log(error);
            }
        ); 
    }
    getReelReponses(): any {
        this.clientReponses.forEach(reponse => {
            this.getResponseById(reponse.id_reponse);
        })
    }
    hasAllResponses(_id_enjeu: any): boolean {
        this.hasAllQuestions = [];
        this.questions.forEach(question => {
            const enjeu = this.getEnjeuByid(question.id_enjeu);
            if (question.id_enjeu === _id_enjeu || enjeu.enjeu_parent === _id_enjeu){
                this.hasAllQuestions.push(question)
            }
        })
        for (const question of this.hasAllQuestions) {
            const bool = this.Responses.find(response => {
                return response.id_question === question.id_question;
            });
            if (!bool){
                return false;
            }
        }
        return true;
    }

    checkEachEnjeux(): boolean{
        for (const enjeu of this.sortedEnjeux){
            const response = this.hasAllResponses(enjeu.id_enjeu);
            if (!response){
                return false;
            }
        }
        return true;
    }
    openModal(): void {
        this.showModal = true;
    }
    
    closeModal(): void {
        this.showModal = false;
    }
    
    confirmValidation(): void {
        this.showModal = false;
    }

    openInfo1(): void {
        this.showInfo = true;
    }
    
    closeInfo1(): void {
        this.showInfo = false;
    }

    openInfo2(): void {
        this.showInfo2 = true;
    }
    
    closeInfo2(): void {
        this.showInfo2 = false;
    }
    // Stockage des réponses sélectionnées pour chaque onglet
  responses = {
    aujourdhui: null as string | null, // Réponse pour aujourd'hui
    engagement: null as string | null, // Réponse pour dans 2 ans
  };

  selectedCheckboxes: string[] = []; // Stocke les réponses sélectionnées pour les checkbox

  // Charger les questions depuis le backend
  loadQuestions(): void {
    this.buttonsService.getQuestionsReponse().subscribe(
      (response) => {
        console.log('Données brutes reçues :', response); // Vérifiez si les doublons viennent du backend
  
        this.questions2 = response.map((q: any, index: number) => ({
          id: q.id_question, // ID de la question
          type: q.type, // Type de la question ('radio', 'checkbox', 'libre')
          number: `Q${index + 1}`, // Numéro de la question
          text: q.sujet, // Texte de la question
          reponses: q.reponses.map((r: any) => ({
            id: r.id_reponse, // ID de la réponse
            text: r.texte, // Texte de la réponse
            id_template: r.id_template,
            score: r.score_individuelle, // Score associé
            champLibre: r.champ_libre, // Si champ libre
          })),
        }));
        console.log('Questions transformées :', this.questions2);
      },
      (error) => {
        console.error('Erreur lors du chargement des questions :', error);
      }
    );
  }

  // Récupérer la question actuelle
  get currentQuestion() {
    return this.questions2[this.currentQuestionIndex] || null;
  }

  // Passer à la question suivante
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions2.length - 1) {
      this.currentQuestionIndex++;
      this.resetResponses(); // Réinitialiser les réponses
      this.selectedQuestionId = this.currentQuestionIndex+1;
    }
  }

  // Revenir à la question précédente
  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.resetResponses(); // Réinitialiser les réponses
      this.selectedQuestionId = this.currentQuestionIndex+1;
    }
  }

  getGoodQuestion(id_question: number): void {
    this.currentQuestionIndex = id_question-1;
    this.resetResponses();
    this.selectedQuestionId = this.currentQuestionIndex+1;
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
    this.selectedCheckboxeAujourdhui = [];
    this.selectedCheckboxeEngagement = [];
    this.champLibreAujourdhui = " ";
    this.champLibreEngagement = " ";
    this.showCommentField = false;
  }

  // Capturer la réponse sélectionnée pour les types 'radio' et 'libre'
  onReponseSelected(reponse: { id: number; text: string }): void {
    if (this.activeTab === 'aujourdhui') {
      this.responses.aujourdhui = reponse.text; // Stocker la réponse pour aujourd'hui
    } else if (this.activeTab === 'engagement') {
      this.responses.engagement = reponse.text; // Stocker la réponse pour dans 2 ans
    }
  }

  onCheckboxChange(event: Event, reponse: { id: number; text: string }): void {
    const checkbox = event.target as HTMLInputElement;

    if (this.activeTab === 'aujourdhui') {
      if (checkbox.checked) {
        this.selectedCheckboxeAujourdhui.push({ id: reponse.id, text: reponse.text });
      } else {
        this.selectedCheckboxeAujourdhui = this.selectedCheckboxeAujourdhui.filter(
          (r) => r.id !== reponse.id
        );
      }
    } else if (this.activeTab === 'engagement') {
      if (checkbox.checked) {
        this.selectedCheckboxeEngagement.push({ id: reponse.id, text: reponse.text });
      } else {
        this.selectedCheckboxeEngagement = this.selectedCheckboxeEngagement.filter(
          (r) => r.id !== reponse.id
        );
      }
    }

  }

  // Confirmer les réponses pour les deux onglets
  // Confirmer les réponses pour les deux onglets
confirmAnswer(): void {
  console.log('Réponses sélectionnées (commentaire) :', this.comment);
  if (!this.currentQuestion) {
    console.warn('Aucune question sélectionnée.');
    return;
  }

  // Gestion des checkboxes pour Aujourd'hui
  if (this.currentQuestion.type === 'checkbox' && this.selectedCheckboxeAujourdhui.length > 0) {
    this.selectedCheckboxeAujourdhui.forEach((reponse) => {
      const reponseUtilisateur = {
        id_client: this.id_client,
        id_question: this.currentQuestion.id,
        id_reponse: reponse.id,
        commentaire: this.comment || null,
        rep_aujourd_hui: reponse.text,
        rep_dans_2_ans: null,
        score_final: 0,
        id_engagement: null,
      };

      console.log('Donnée envoyée pour aujourdhui :', reponseUtilisateur);

      this.buttonsService.saveReponseClient(reponseUtilisateur).subscribe(
        (response) => {
          console.log('Réponse sauvegardée avec succès pour Aujourd\'hui :', response);
        },
        (error) => {
          console.error('Erreur lors de la sauvegarde pour Aujourd\'hui :', error);
        }
      );
    });
  }

  // Gestion des checkboxes pour Engagement
  if (this.currentQuestion.type === 'checkbox' && this.selectedCheckboxeEngagement.length > 0) {
    this.selectedCheckboxeEngagement.forEach((reponse) => {
      const reponseUtilisateur = {
        id_client: this.id_client,
        id_question: this.currentQuestion.id,
        id_reponse: reponse.id,
        commentaire: this.comment || null,
        rep_aujourd_hui: null,
        rep_dans_2_ans: reponse.text,
        score_final: 0,
        id_engagement: null,
      };

      console.log('Donnée envoyée pour Engagement :', reponseUtilisateur);

      this.buttonsService.saveReponseClient(reponseUtilisateur).subscribe(
        (response) => {
          console.log('Réponse sauvegardée avec succès pour Engagement :', response);
        },
        (error) => {
          console.error('Erreur lors de la sauvegarde pour Engagement :', error);
        }
      );
    });
  }
    // Gestion des réponses de type 'radio'
    if (this.currentQuestion.type === 'radio') {
      const selectedReponse = this.currentQuestion.reponses.find(
        (r: { id: number; text: string }) => r.text === this.responses.aujourdhui
      );
      const reponseUtilisateur = {
        id_client: this.id_client,
        id_question: this.currentQuestion.id,
        id_reponse: selectedReponse ? selectedReponse.id : null,
        commentaire: this.comment || null,
        rep_aujourd_hui: this.responses.aujourdhui || null,
        rep_dans_2_ans: this.responses.engagement || null,
        score_final: 0,
        id_engagement: null,
      };
  
      console.log('Donnée envoyée pour Radio :', reponseUtilisateur);
  
      this.buttonsService.saveReponseClient(reponseUtilisateur).subscribe(
        (response) => {
          console.log('Réponse sauvegardée avec succès pour Radio :', response);
        },
        (error) => {
          console.error('Erreur lors de la sauvegarde pour Radio :', error);
        }
      );
    }


    if (this.currentQuestion.type === 'libre') {
      console.log(this.currentQuestion.reponses);
      const reponseUtilisateur = {
        id_client: this.id_client,
        id_question: this.currentQuestion.id,
        id_reponse: this.currentQuestion.reponses[0].id,
        commentaire: this.comment || null,
        rep_aujourd_hui: this.champLibreAujourdhui || null,
        rep_dans_2_ans: this.champLibreEngagement || null,
        score_final: 0,
        id_engagement: null,
      };
    
      console.log('Donnée envoyée pour champ texte:', reponseUtilisateur);
    
      this.buttonsService.saveReponseClient(reponseUtilisateur).subscribe(
        (response) => {
          console.log('Réponse sauvegardée avec succès :', response);
        },
        (error) => {
          console.error('Erreur lors de la sauvegarde :', error);
        }
      );
    }
    
    

  // Réinitialiser après envoi
  this.resetResponses();
  this.nextQuestion();
}
}