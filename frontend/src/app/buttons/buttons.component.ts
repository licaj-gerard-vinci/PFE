import { Component, OnInit } from '@angular/core';
import { ButtonsService } from '../services/buttons.service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-try',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './buttons.component.html',
    styleUrls: ['./buttons.component.scss'],
  })
  export class Buttons implements OnInit{
    enjeux: any[] = [];
    questions: any[] = [];
    clientReponses: any[] = [];
    sortedQuestions: any[] = [];
    sortedEnjeux: any[] = [];
    selectedEnjeuId: number | null = null;
    selectedQuestionId: number | null = null;
    id_client: number = 1;
    hasAllQuestions : any[] = [];
    Responses: any[] = [];
    showModal: boolean = false;
    constructor(private buttonsService: ButtonsService) {}

    ngOnInit(): void {
        this.getEnjeux();
        this.getQuestions();
        this.getClientResponses();
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
                if (question.id_enjeu === _id_enjeu || enjeu.enjeu_parent === _id_enjeu){
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
    
    selectQuestion(questionId: number): void {
        this.selectedQuestionId = questionId;
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
        // Logique de validation ici
        console.log('Validation confirmée');
      }
}