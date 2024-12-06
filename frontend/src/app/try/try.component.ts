import { Component, OnInit } from '@angular/core';
import { ButtonsService } from '../services/buttons.service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-try',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './try.component.html',
    styleUrls: ['./try.component.scss'],
  })
  export class Try implements OnInit{
    enjeux: any[] = [];
    constructor(private buttonsService: ButtonsService) {}

    ngOnInit(): void {
        this.onSubmit();
    }

    onSubmit() {
        console.log("bouton appuyé")
        this.buttonsService.getEnjeux().subscribe(
            (response) =>  {
                this.enjeux = response;
                console.log(this.enjeux);
            },
            (error) => {
                console.log(error)
            }
        )
    }

  }