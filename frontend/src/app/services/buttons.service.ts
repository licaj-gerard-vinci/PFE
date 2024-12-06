import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ButtonsService {
    private baseUrl = 'http://127.0.0.1:8000/buttons'; // Backend URL

    constructor(private http: HttpClient) {}

    getEnjeux(): Observable<any> {
        return this.http.get(`${this.baseUrl}/enjeux`);
    }
    getQuestions(): Observable<any> {
        return this.http.get(`${this.baseUrl}/questions`);
    }
}
