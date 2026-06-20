import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  usuario: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.usuario, this.password).subscribe({
     next: (response) => {

        this.authService.guardarSesion(
        response.token,
        response.rol
        );

        if(response.rol === 'ROLE_ADMIN'){
        this.router.navigate(['/admin']);
        }

         if(response.rol === 'ROLE_MEDICO'){
        this.router.navigate(['/medico']);
          }

      },

      error: () => {
        this.error = 'Usuario o contraseña incorrectos';
      }
    });
  }
}
