import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class DisponibilidadService {
  private apiUrl = 'http://localhost:8080/api/disponibilidades';
  private citasUrl = 'http://localhost:8080/api/citas';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.obtenerToken()}`,
    });
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  crear(disponibilidad: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, disponibilidad, { headers: this.getHeaders() });
  }

  actualizar(id: number, disponibilidad: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, disponibilidad, { headers: this.getHeaders() });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  obtenerHorariosLibres(medicoId: number, fecha: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.citasUrl}/disponibilidad/${medicoId}?fecha=${fecha}`,
      { headers: this.getHeaders() }
    );
  }

  reservarCita(dto: any): Observable<any> {
    return this.http.post<any>(`${this.citasUrl}/reservar`, dto, { headers: this.getHeaders() });
  }
}