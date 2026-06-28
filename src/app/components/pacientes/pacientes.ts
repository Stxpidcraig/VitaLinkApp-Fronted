import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../services/paciente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class PacientesComponent implements OnInit {

  pacientes: any[] = [];
  pacienteSeleccionado: any = null;
  modoEdicion: boolean = false;

  formulario = {
    dni: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexo: '',
    telefono: '',
    correo: '',
    direccion: ''
  };

  constructor(private pacienteService: PacienteService, private cd:ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.pacienteService.listar().subscribe({
      next: (data) => {this.pacientes = [...data];
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  limpiarBuscador(): void {
  this.busqueda = '';
  this.busquedaDni = '';
  }

  nuevo(): void {
    this.modoEdicion = false;
    this.pacienteSeleccionado = null;
    this.formulario = { dni: '', nombres: '', apellidos: '', fechaNacimiento: '', sexo: '', telefono: '', correo: '', direccion: '' };
  }

  editar(paciente: any): void {
    this.modoEdicion = true;
    this.pacienteSeleccionado = paciente;
    this.formulario = { ...paciente };
    this.cd.detectChanges();
  }

  guardar(): void {
    if (this.modoEdicion) {
      this.pacienteService.actualizar(this.pacienteSeleccionado.id, this.formulario).subscribe({
        next: () => { this.listar(); this.nuevo(); }
      });
    } else {
      this.pacienteService.crear(this.formulario).subscribe({
        next: () => { this.listar(); this.nuevo(); }
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este paciente?')) {
      this.pacienteService.eliminar(id).subscribe({
        next: () => this.listar()
      });
    }
  }

  busqueda: string = '';
  busquedaDni: string = '';
  get pacientesFiltrados(): any[] {
  return this.pacientes.filter(p =>
    (p.nombres.toLowerCase().includes(this.busqueda.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(this.busqueda.toLowerCase())) &&
    p.dni.startsWith(this.busquedaDni)
  );
  }

  verHistoria(pacienteId: number): void {
  this.router.navigate(['/historia-clinica', pacienteId]);
}
}
