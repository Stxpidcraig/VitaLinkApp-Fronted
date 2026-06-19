import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private apiUrl = 'http://localhost:8083/api/pacientes';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.obtenerToken()}`
    });
  }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  crear(paciente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, paciente, { headers: this.getHeaders() });
  }

  actualizar(id: number, paciente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, paciente, { headers: this.getHeaders() });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
