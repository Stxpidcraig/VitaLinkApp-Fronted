import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../../services/medico';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicos.html',
  styleUrl: './medicos.css',
})
export class MedicosComponent implements OnInit {
  medicos: any[] = [];
  medicoSeleccionado: any = null;
  modoEdicion: boolean = false;

  formulario = {
    nombres: '',
    apellidos: '',
    telefono: '',
    correo: '',
    especialidadId: '',
  };

  constructor(private medicoService: MedicoService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.medicoService.listar().subscribe({
      next: (data) => (this.medicos = data),
      error: (err) => console.error(err),
    });
  }

  nuevo(): void {
    this.modoEdicion = false;
    this.medicoSeleccionado = null;
    this.formulario = { nombres: '', apellidos: '', telefono: '', correo: '', especialidadId: '' };
  }

  editar(medico: any): void {
    this.modoEdicion = true;
    this.medicoSeleccionado = medico;
    this.formulario = { ...medico };
  }

  guardar(): void {
    if (this.modoEdicion) {
      this.medicoService.actualizar(this.medicoSeleccionado.id, this.formulario).subscribe({
        next: () => {
          this.listar();
          this.nuevo();
        },
      });
    } else {
      this.medicoService.crear(this.formulario).subscribe({
        next: () => {
          this.listar();
          this.nuevo();
        },
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este médico?')) {
      this.medicoService.eliminar(id).subscribe({
        next: () => this.listar(),
      });
    }
  }
}
