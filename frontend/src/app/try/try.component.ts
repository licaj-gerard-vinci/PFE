import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
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
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.onSubmit();
    }

    onSubmit() {
        console.log("bouton appuyé")
        this.authService.getEnjeux().subscribe(
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