import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = '/api/compras';

  constructor(private http: HttpClient) {}

  getCompras(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addCompra(compra: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, compra);
  }

  cancelarCompra(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
