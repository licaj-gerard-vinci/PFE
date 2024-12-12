// frontend/src/app/services/form-validation.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {
  private formValidatedSource = new BehaviorSubject<boolean>(false);
  formValidated$ = this.formValidatedSource.asObservable();

  setFormValidated(validated: boolean) {
    this.formValidatedSource.next(validated);
  }
}