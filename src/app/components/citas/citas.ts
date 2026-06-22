import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CitasService } from '../../services/citas';
import { MedicoService } from '../../services/medico';
import { PacienteService } from '../../services/paciente';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class CitasComponent implements OnInit {

  citas: any[] = [];
  medicos: any[] = [];
  pacientes: any[] = [];

  citaSeleccionada: any = null;
  modoEdicion = false;

  formulario = {
    estado: '',
    motivo: '',
    fechaHora: '',
    medicoId: null as number | null,
    pacienteId: null as number | null,
  };

  constructor(
    private citasService: CitasService,
    private medicoService: MedicoService,
    private pacienteService: PacienteService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listar();
    this.listarMedicos();
    this.listarPacientes();
  }

  listar(): void {
    this.citasService.listar().subscribe({
      next: (data: any) => {
        this.citas = [...data];
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  listarMedicos(): void {
    this.medicoService.listar().subscribe({
      next: (data) => (this.medicos = data),
      error: (err) => console.error(err),
    });
  }

  listarPacientes(): void {
    this.pacienteService.listar().subscribe({
      next: (data) => (this.pacientes = data),
      error: (err) => console.error(err),
    });
  }

  guardar(): void {
    const payload = {
      estado: this.formulario.estado,
      motivo: this.formulario.motivo,
      fechaHora: this.formulario.fechaHora,
      medico: { id: this.formulario.medicoId },
      paciente: { id: this.formulario.pacienteId },
    };

    if (this.modoEdicion) {
      this.citasService.actualizar(this.citaSeleccionada.id, payload).subscribe(() => {
        this.listar();
        this.nuevo();
      });
    } else {
      this.citasService.crear(payload).subscribe(() => {
        this.listar();
        this.nuevo();
      });
    }
  }

  editar(cita: any): void {
    this.modoEdicion = true;
    this.citaSeleccionada = cita;

    this.formulario.estado = cita.estado;
    this.formulario.motivo = cita.motivo;
    this.formulario.fechaHora = cita.fechaHora;

    this.formulario.medicoId = cita.medico?.id ?? null;
    this.formulario.pacienteId = cita.paciente?.id ?? null;

    this.cd.detectChanges();

  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta cita?')) {
      this.citasService.eliminar(id).subscribe({
        next: () => this.listar(),
        error: (err) => console.error(err),
      });
    }
  }

  nuevo(): void {
    this.modoEdicion = false;
    this.citaSeleccionada = null;

    this.formulario = {
      estado: '',
      motivo: '',
      fechaHora: '',
      medicoId: null as number | null,
      pacienteId: null as number | null,
    };
  }

  irAdmin(): void {
    this.router.navigate(['/admin']);
  }
}