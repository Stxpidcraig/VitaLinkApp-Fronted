import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EspecialidadService } from '../../services/especialidad';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialidades.html',
  styleUrl: './especialidades.css',
})
export class EspecialidadesComponent implements OnInit {
  especialidades: any[] = [];
  especialidadSeleccionada: any = null;
  modoEdicion: boolean = false;

  formulario = {
    nombre: '',
    descripcion: '',
  };

  constructor(private especialidadService: EspecialidadService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.especialidadService.listar().subscribe({
      next: (data) => (this.especialidades = data),
      error: (err) => console.error(err),
    });
  }

  nuevo(): void {
    this.modoEdicion = false;
    this.especialidadSeleccionada = null;
    this.formulario = { nombre: '', descripcion: '' };
  }

  editar(especialidad: any): void {
    this.modoEdicion = true;
    this.especialidadSeleccionada = especialidad;
    this.formulario = { ...especialidad };
  }

  guardar(): void {
    if (this.modoEdicion) {
      this.especialidadService.actualizar(this.especialidadSeleccionada.id, this.formulario).subscribe({
        next: () => { this.listar(); this.nuevo(); },
      });
    } else {
      this.especialidadService.crear(this.formulario).subscribe({
        next: () => { this.listar(); this.nuevo(); },
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta especialidad?')) {
      this.especialidadService.eliminar(id).subscribe({
        next: () => this.listar(),
      });
    }
  }
}