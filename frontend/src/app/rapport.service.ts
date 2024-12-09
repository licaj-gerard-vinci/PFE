import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RapportService {
  private apiUrl = 'http://127.0.0.1:8000/report';

  constructor(private http: HttpClient) {}

  getRapport(clientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${clientId}/`);
  }
}