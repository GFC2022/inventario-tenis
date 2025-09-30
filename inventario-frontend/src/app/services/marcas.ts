import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcasService {
  private apiUrl = '/api/marcas';  // proxy a backend

  constructor(private http: HttpClient) {}

  getMarcas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
