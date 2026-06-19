import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
  private apiUrl = 'http://localhost:8083/api/medicos';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.obtenerToken()}`,
    });
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  crear(medico: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, medico, { headers: this.getHeaders() });
  }

  actualizar(id: number, medico: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, medico, { headers: this.getHeaders() });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
