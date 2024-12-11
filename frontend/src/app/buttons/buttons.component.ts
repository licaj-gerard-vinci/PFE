import { Component, OnInit } from '@angular/core';
import { ButtonsService } from '../services/buttons.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-try',
    standalone: true,
    imports: [CommonModule, FormsModule, MatProgressBarModule],
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
    id_client: number = 0;
    hasAllQuestions : any[] = [];
    Responses: any[] = [];
    showModal: boolean = false;
    showInfo: boolean = false;
    showInfo2: boolean = false;
    clientsTemplates: any[] = [];
    champLibreAujourdhui: string = '';
    champLibreEngagement: string = '';
    selectedCheckboxeAujourdhui: { id: number; text: string; score:number; score_engagement: number }[] = [];
    selectedCheckboxeEngagement: { id: number; text: string; score:number; score_engagement: number }[] = [];
    showCommentField: boolean = false;
    comment: string = '';
    champLibre: string = '';
    reponseQuestionClient: any[] = [];
    constructor(private buttonsService: ButtonsService) {}

    ngOnInit(): void {
      this.buttonsService.getSimulatedLogin().subscribe(
          (response) => {
              this.id_client = response.id_client;
              console.log('ID Client récupéré :', this.id_client);

              console.log('Informations complètes du client connecté :', {
                  prenom: response.prenom,
                  nom: response.nom,
                  email: response.adresse_mail
              });

              this.getEnjeux();
              this.getQuestions();
              this.getClientResponses();
              this.loadQuestions();
              this.getTemplates();
          },
          (error) => {
              console.error('Utilisateur non connecté ou erreur :', error);

              alert('Vous devez être connecté pour accéder à ce formulaire.');
          }
      );
  }

    getProgressPercentage(): number {
      if (this.questions2.length === 0) {
        return 0;
      }
      return ((this.currentQuestionIndex + 1) / this.questions2.length) * 100;
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
      this.clientReponses = [];
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
            },
            (error) => {
                console.log(error);
            }
        );
    }
    getClientAnswer(questionId: number): any[] {
      return this.Responses.filter(res => res.id_question === questionId) || [];
    }
    

    checkIfCanAnswer(questionId: number): boolean {
      const question = this.questions2.find(q => q.id === questionId);
      if (!question || !question.reponses) {
        return false;
      }
      const allBlocked = question.reponses.some((reponse: any) => this.checkTemplatesReponses(reponse));
    
      return  allBlocked;
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
          if (!this.checkIfCanAnswer(question.id_question)){
          } else {
            const bool = this.Responses.find(response => {
            return response.id_question === question.id_question;
          });
            if (!bool){
              return false;
            }
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
  responses = {
    aujourdhui: null as string | null, 
    engagement: null as string | null, 
  };

  selectedCheckboxes: string[] = []; 

  loadQuestions(): void {
    this.buttonsService.getQuestionsReponse().subscribe(
      (response) => {
        this.questions2 = response.map((q: any, index: number) => ({
          id: q.id_question,
          type: q.type,
          number: `Q${index + 1}`,
          text: q.sujet,
          reponses: q.reponses.map((r: any) => ({
            id: r.id_reponse,
            text: r.texte,
            id_template: r.id_template,
            score: r.score_individuel, 
            champLibre: r.champ_libre,
            score_engagement: r.score_engagement
          })),
        }));
      },
      (error) => {
        console.error('Erreur lors du chargement des questions :', error);
      }
    );
  }

  get currentQuestion() {
    return this.questions2[this.currentQuestionIndex] || null;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions2.length - 1) {
      this.currentQuestionIndex++;
      this.resetResponses(); 
      this.selectedQuestionId = this.currentQuestionIndex+1;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.resetResponses(); 
      this.selectedQuestionId = this.currentQuestionIndex+1;
    }
  }

  getGoodQuestion(id_question: number): void {
    this.currentQuestionIndex = id_question-1;
    this.resetResponses();
    this.selectedQuestionId = this.currentQuestionIndex+1;
  }

  switchTab(tab: 'aujourdhui' | 'engagement'): void {
    this.activeTab = tab;
  }

  resetResponses(): void {
    this.responses.aujourdhui = null;
    this.responses.engagement = null;
    this.selectedCheckboxes = []; 
    this.selectedCheckboxeAujourdhui = [];
    this.selectedCheckboxeEngagement = [];
    this.champLibreAujourdhui = " ";
    this.champLibreEngagement = " ";
    this.showCommentField = false;
    this.comment = '';
  }

  onReponseSelected(reponse: { id: number; text: string; score: number; score_engagement: number}): void {
    if (this.activeTab === 'aujourdhui') {
      this.responses.aujourdhui = reponse.text;
    } else if (this.activeTab === 'engagement') {
      this.responses.engagement = reponse.text;
    }
  }

  onCheckboxChange(event: Event, reponse: { id: number; text: string; score: number; score_engagement:number}): void {
    console.log(this.selectedCheckboxeAujourdhui);
    console.log(this.selectedCheckboxeEngagement);
    const checkbox = event.target as HTMLInputElement;
    if (this.activeTab === 'aujourdhui') {
      if (checkbox.checked) {
        this.selectedCheckboxeAujourdhui.push({ id: reponse.id, text: reponse.text, score: reponse.score, score_engagement:reponse.score_engagement });
      } else {
        this.selectedCheckboxeAujourdhui = this.selectedCheckboxeAujourdhui.filter(
          (r) => r.id !== reponse.id
        );
      }
    } else if (this.activeTab === 'engagement') {
      if (checkbox.checked) {
        this.selectedCheckboxeEngagement.push({ id: reponse.id, text: reponse.text, score: reponse.score, score_engagement: reponse.score_engagement });
      } else {
        this.selectedCheckboxeEngagement = this.selectedCheckboxeEngagement.filter(
          (r) => r.id !== reponse.id
        );
      }
    }

  }
  isAnswered(questionId: number): boolean {
    return this.Responses.some(response => response.id_question === questionId);
  }
  getText(table: any[],text: string){
    return table.some(r => r.text === text);
  }

  confirmAnswer(): void {
    if (!this.currentQuestion) {
      console.warn('Aucune question sélectionnée.');
      return;
    }

    if (this.currentQuestion.type === 'checkbox' && this.selectedCheckboxeAujourdhui.length > 0) {
      this.selectedCheckboxeAujourdhui.forEach((reponse) => {
        const reponseUtilisateur = {
          id_client: this.id_client,
          id_question: this.currentQuestion.id,
          id_reponse: reponse.id,
          commentaire: this.comment || null,
          rep_aujourd_hui: reponse.text,
          rep_dans_2_ans: null,
          est_engagement: false,
          score_final: reponse.score,
          id_engagement: null,
        };
        this.enregistrerReponse(reponseUtilisateur);
      });
    }

    if (this.currentQuestion.type === 'checkbox' && this.selectedCheckboxeEngagement.length > 0) {
      this.selectedCheckboxeEngagement.forEach((reponse) => {
        const reponseUtilisateur = {
          id_client: this.id_client,
          id_question: this.currentQuestion.id,
          id_reponse: reponse.id,
          commentaire: this.comment || null,
          rep_aujourd_hui: null,
          rep_dans_2_ans: reponse.text,
          est_engagement: true,
          score_final: reponse.score_engagement,
          id_engagement: null,
        };
        console.log('Donnée envoyée pour Engagement :', reponseUtilisateur);
        this.enregistrerReponse(reponseUtilisateur);
      });
    }
      if (this.currentQuestion.type === 'radio') {
        console.log(this.responses);
        if (this.responses.aujourdhui !== null && this.responses.engagement !== null){
          const selectedReponse = this.currentQuestion.reponses.find(
            (r: { id: number; text: string; score:number; score_engagement:number }) => r.text === this.responses.aujourdhui
          );
          const selectedReponse2 = this.currentQuestion.reponses.find(
            (r: { id: number; text: string; score:number; score_engagement:number }) => r.text === this.responses.engagement
          );
          const reponseUtilisateur = {
            id_client: this.id_client,
            id_question: this.currentQuestion.id,
            id_reponse: selectedReponse ? selectedReponse.id : null,
            commentaire: this.comment || null,
            rep_aujourd_hui: this.responses.aujourdhui || null,
            rep_dans_2_ans: null,
            est_engagement: false,
            score_final: selectedReponse.score,
            id_engagement: null,
          };
          const reponseUtilisateur2 = {
            id_client: this.id_client,
            id_question: this.currentQuestion.id,
            id_reponse: selectedReponse2 ? selectedReponse2.id : null,
            commentaire: this.comment || null,
            rep_aujourd_hui: null,
            rep_dans_2_ans: this.responses.engagement || null,
            est_engagement: true,
            score_final: selectedReponse2.score_engagement,
            id_engagement: null,
          };
      
          this.enregistrerReponse(reponseUtilisateur);
          this.enregistrerReponse(reponseUtilisateur2);
        } else{
        let selectedReponse = this.currentQuestion.reponses.find(
          (r: { id: number; text: string; score:number; score_engagement:number }) => r.text === this.responses.aujourdhui
        );
        if (!selectedReponse){
          selectedReponse = this.currentQuestion.reponses.find(
            (r: { id: number; text: string; score:number; score_engagement:number }) => r.text === this.responses.engagement
          );
        }
        let est_enga = false;
        if (this.responses.aujourdhui === null){
          est_enga = true;
        }
        let score_final;
        if (this.responses.aujourdhui === null){
          console.log(selectedReponse.score_engagement);
          score_final = selectedReponse.score_engagement;
          const reponseUtilisateur = {
            id_client: this.id_client,
            id_question: this.currentQuestion.id,
            id_reponse: selectedReponse ? selectedReponse.id : null,
            commentaire: this.comment || null,
            rep_aujourd_hui: this.responses.aujourdhui || null,
            rep_dans_2_ans: this.responses.engagement || null,
            est_engagement: est_enga,
            score_final: score_final,
            id_engagement: null,
          };
          this.enregistrerReponse(reponseUtilisateur);
        }
        if (this.responses.engagement === null){
          score_final = selectedReponse.score;
          const reponseUtilisateur = {
            id_client: this.id_client,
            id_question: this.currentQuestion.id,
            id_reponse: selectedReponse ? selectedReponse.id : null,
            commentaire: this.comment || null,
            rep_aujourd_hui: this.responses.aujourdhui || null,
            rep_dans_2_ans: this.responses.engagement || null,
            est_engagement: est_enga,
            score_final: score_final,
            id_engagement: null,
          };
          this.enregistrerReponse(reponseUtilisateur);
        } 
      }
      }


      if (this.currentQuestion.type === 'libre') {
        if (this.champLibreAujourdhui !== " " && this.champLibreEngagement !== " "){
          const reponseUtilisateur = {
            id_client: this.id_client,
            id_question: this.currentQuestion.id,
            id_reponse: this.currentQuestion.reponses[0].id,
            commentaire: this.comment || null,
            rep_aujourd_hui: this.champLibreAujourdhui || null,
            rep_dans_2_ans: null,
            est_engagement: false,
            score_final: 0,
            id_engagement: null,
          };
          const reponseUtilisateur2 = {
            id_client: this.id_client,
            id_question: this.currentQuestion.id,
            id_reponse: this.currentQuestion.reponses[0].id,
            commentaire: this.comment || null,
            rep_aujourd_hui: null,
            rep_dans_2_ans: this.champLibreEngagement || null,
            est_engagement: true,
            score_final: 0,
            id_engagement: null,
          };
          
          this.enregistrerReponse(reponseUtilisateur);
          this.enregistrerReponse(reponseUtilisateur2);
        } else {
          let est_enga = false;
          if (this.champLibreAujourdhui === " "){
              est_enga = true;
          }
          const reponseUtilisateur = {
            id_client: this.id_client,
            id_question: this.currentQuestion.id,
            id_reponse: this.currentQuestion.reponses[0].id,
            commentaire: this.comment || null,
            rep_aujourd_hui: this.champLibreAujourdhui || null,
            rep_dans_2_ans: this.champLibreEngagement || null,
            est_engagement: est_enga,
            score_final: 0,
            id_engagement: null,
          };
          this.enregistrerReponse(reponseUtilisateur);
        }
      }
    this.resetResponses();
    this.nextQuestion();
  }
toggleCommentField(): void {

  if(this.showCommentField == false){
    this.showCommentField = true;
  }else{
    this.showCommentField = false; 
  }

}
enregistrerReponse(reponseUtilisateur:any){
  this.buttonsService.saveReponseClient(reponseUtilisateur).subscribe(
    (response) => {
      console.log('Réponse sauvegardée avec succès:', response);
      const reponse = this.getResponseById(reponseUtilisateur.id_reponse)
      this.clientReponses.push(reponse);
    },
    (error) => {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  );
}

onCommentInput(event: Event): void {
  this.comment = (event.target as HTMLTextAreaElement).value; 
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
getExistingAnswer(questionId: number) {
  const bool = this.Responses.find(response => response.id_question === questionId);
  if (!bool){
    return false;
  }
  return true;
}
copyLink() {
  const currentUrl = window.location.href; // Obtient l'URL actuelle
  navigator.clipboard.writeText(currentUrl)
    .then(() => {
      alert('Lien copié dans le presse-papier !'); // Message de confirmation
    })
    .catch(err => {
      console.error('Erreur lors de la copie du lien :', err);
      alert('Impossible de copier le lien.');
    });
}
}