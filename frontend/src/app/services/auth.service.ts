import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = 'http://127.0.0.1:8000/auth'; // Backend URL

    constructor(private http: HttpClient) {}

    register(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/register/`, data);
    }

    login(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/login/`, data);
    }
}
