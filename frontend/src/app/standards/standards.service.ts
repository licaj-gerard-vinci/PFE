import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StandardsService {
  private apiUrl = 'http://127.0.0.1:8000/standards'; // Chemin mis à jour

  constructor(private http: HttpClient) {}

  getStandards(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all/`);
  }

}