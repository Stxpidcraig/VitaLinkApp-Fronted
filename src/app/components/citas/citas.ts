import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CitasService } from '../../services/citas';
import { MedicoService } from '../../services/medico';
import { PacienteService } from '../../services/paciente';
import { DisponibilidadService } from '../../services/disponibilidad';
import { EspecialidadService } from '../../services/especialidad';

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
  horariosLibres: string[] = [];

  citaSeleccionada: any = null;
  modoEdicion = false;
  errorMensaje = '';

  formulario = {
    estado: 'PENDIENTE',
    motivo: '',
    fecha: '',
    horaSeleccionada: '',
    medicoId: null as number | null,
    pacienteId: null as number | null,
  };

  constructor(
    private citasService: CitasService,
    private medicoService: MedicoService,
    private pacienteService: PacienteService,
    private disponibilidadService: DisponibilidadService,
    private especialidadService: EspecialidadService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.listar();
    this.listarMedicos();
    this.listarPacientes();
    this.listarEspecialidades();
  }

  listarEspecialidades(): void {
  this.especialidadService.listar().subscribe({
    next: (data) => (this.especialidades = data),
    error: (err) => console.error(err),
  });
}
get medicosFiltrados(): any[] {
  if (!this.especialidadFiltro) return this.medicos;
  return this.medicos.filter(m => m.especialidad?.id === this.especialidadFiltro);
}

onMedicoSeleccionado(): void {
  const medico = this.medicos.find(m => m.id === this.formulario.medicoId);
  if (medico) {
    this.especialidadFiltro = medico.especialidad?.id ?? null;
  }
  this.consultarHorarios();
}

  listar(): void {
    this.citasService.listar().subscribe({
      next: (data) => { this.citas = [...data]; this.cd.detectChanges(); },
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

  consultarHorarios(): void {
    if (!this.formulario.medicoId || !this.formulario.fecha) return;

    this.horariosLibres = [];
    this.formulario.horaSeleccionada = '';

    this.disponibilidadService
      .obtenerHorariosLibres(this.formulario.medicoId, this.formulario.fecha)
      .subscribe({
        next: (data) => {
          this.horariosLibres = data;
          this.cd.detectChanges();
        },
        error: () => { this.horariosLibres = []; },
      });
  }

  guardar(): void {
    this.errorMensaje = '';

    if (this.modoEdicion) {

      const payload = {
        estado: this.formulario.estado,
        motivo: this.formulario.motivo,
        fechaHora: `${this.formulario.fecha}T${this.formulario.horaSeleccionada}`,
        medico: { id: this.formulario.medicoId },
        paciente: { id: this.formulario.pacienteId },
      };
      this.citasService.actualizar(this.citaSeleccionada.id, payload).subscribe({
        next: () => { this.listar(); this.nuevo(); },
        error: (err) => {
        this.errorMensaje = err.error?.message || err.error || 'Error al actualizar';
         this.cd.detectChanges();
        },
      });
    } else {

      const dto = {
        medicoId: this.formulario.medicoId,
        pacienteId: this.formulario.pacienteId,
        fechaHora: `${this.formulario.fecha}T${this.formulario.horaSeleccionada}`,
        motivo: this.formulario.motivo,
        estado: this.formulario.estado,
      };
      this.disponibilidadService.reservarCita(dto).subscribe({
        next: () => { this.listar(); this.nuevo(); },
        error: (err) => {
        this.errorMensaje = err.error?.message || err.error || 'Horario no disponible';
        this.cd.detectChanges();
        },
      });
    }
  }

  editar(cita: any): void {
    this.modoEdicion = true;
    this.citaSeleccionada = cita;
    const fechaHora = cita.fechaHora?.split('T');
    this.formulario = {
      estado: cita.estado,
      motivo: cita.motivo,
      fecha: fechaHora?.[0] ?? '',
      horaSeleccionada: fechaHora?.[1]?.substring(0, 5) ?? '',
      medicoId: cita.medico?.id ?? null,
      pacienteId: cita.paciente?.id ?? null,
    };
    this.cd.detectChanges();
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta cita?')) {
      this.citasService.eliminar(id).subscribe({
        next: () => this.listar(),
      });
    }
  }

  nuevo(): void {
    this.modoEdicion = false;
    this.citaSeleccionada = null;
    this.horariosLibres = [];
    this.errorMensaje = '';
    this.formulario = {
      estado: 'PENDIENTE',
      motivo: '',
      fecha: '',
      horaSeleccionada: '',
      medicoId: null,
      pacienteId: null,
    };
  }

  irAdmin(): void {
    this.router.navigate(['/admin']);
  }

  especialidades: any[] = [];
  especialidadFiltro: number | null = null;
}