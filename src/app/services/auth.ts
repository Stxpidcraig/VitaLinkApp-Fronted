import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) {}

 
  login(username: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, {
    username,
    password
  });
  }

  guardarSesion(token: string, rol: string): void {

  localStorage.setItem('token', token);

  localStorage.setItem('rol', rol);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  
  obtenerRol(): string | null {
  return localStorage.getItem('rol');
  }

  cerrarSesion(): void {

  localStorage.removeItem('token');

  localStorage.removeItem('rol');
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }
}
