import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerosService {
  private apiUrl = '/api/generos';  // proxy a backend

  constructor(private http: HttpClient) {}

  getGeneros(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
