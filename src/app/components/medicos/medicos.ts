import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../../services/medico';
import { EspecialidadService } from '../../services/especialidad';
import { DisponibilidadService } from '../../services/disponibilidad';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicos.html',
  styleUrl: './medicos.css',
})
export class MedicosComponent implements OnInit {
  medicos: any[] = [];
  especialidades: any[] = [];
  medicoSeleccionado: any = null;
  modoEdicion = false;

  medicoHorarios: any = null;
  disponibilidades: any[] = [];
  modoEdicionHorario = false;
  horarioSeleccionado: any = null;

  diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  formularioHorario = {
    diaSemana: '',
    horaInicio: '',
    horaFin: '',
  };

  formulario = {
    nombres: '',
    apellidos: '',
    telefono: '',
    correo: '',
    especialidadId: null as any,
  };

  busqueda = '';
  busquedaEspecialidad = '';

  constructor(
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private disponibilidadService: DisponibilidadService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listar();
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.especialidadService.listar().subscribe({
      next: (data) => (this.especialidades = data),
      error: (err) => console.error(err),
    });
  }

  listar(): void {
    this.medicoService.listar().subscribe({
      next: (data) => { this.medicos = [...data]; this.cd.detectChanges(); },
      error: (err) => console.error(err),
    });
  }

  nuevo(): void {
    this.modoEdicion = false;
    this.medicoSeleccionado = null;
    this.formulario = { nombres: '', apellidos: '', telefono: '', correo: '', especialidadId: null };
  }

  editar(medico: any): void {
    this.modoEdicion = true;
    this.medicoSeleccionado = medico;
    this.formulario = {
      nombres: medico.nombres,
      apellidos: medico.apellidos,
      telefono: medico.telefono,
      correo: medico.correo,
      especialidadId: medico.especialidad?.id,
    };
    this.cd.detectChanges();
  }

  guardar(): void {
    const payload = {
      nombres: this.formulario.nombres,
      apellidos: this.formulario.apellidos,
      telefono: this.formulario.telefono,
      correo: this.formulario.correo,
      especialidad: this.formulario.especialidadId ? { id: this.formulario.especialidadId } : null,
    };

    if (this.modoEdicion) {
      this.medicoService.actualizar(this.medicoSeleccionado.id, payload).subscribe({
        next: () => { this.listar(); this.nuevo(); },
      });
    } else {
      this.medicoService.crear(payload).subscribe({
        next: () => { this.listar(); this.nuevo(); },
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar este médico?')) {
      this.medicoService.eliminar(id).subscribe({
        next: () => {
          if (this.medicoHorarios?.id === id) this.medicoHorarios = null;
          this.listar();
        },
      });
    }
  }

  limpiarBuscador(): void {
    this.busqueda = '';
    this.busquedaEspecialidad = '';
  }

  get medicosFiltrados(): any[] {
    return this.medicos.filter(m =>
      (m.nombres.toLowerCase().includes(this.busqueda.toLowerCase()) ||
       m.apellidos.toLowerCase().includes(this.busqueda.toLowerCase())) &&
      m.especialidad?.nombre.toLowerCase().includes(this.busquedaEspecialidad.toLowerCase())
    );
  }


  verHorarios(medico: any): void {
    if (this.medicoHorarios?.id === medico.id) {
      this.medicoHorarios = null;
      this.disponibilidades = [];
      return;
    }
    this.medicoHorarios = medico;
    this.modoEdicionHorario = false;
    this.horarioSeleccionado = null;
    this.formularioHorario = { diaSemana: '', horaInicio: '', horaFin: '' };
    this.cargarDisponibilidades();
  }

  cargarDisponibilidades(): void {
    this.disponibilidadService.listar().subscribe({
      next: (data) => {
        this.disponibilidades = data.filter(d => d.medico?.id === this.medicoHorarios.id);
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  nuevoHorario(): void {
    this.modoEdicionHorario = false;
    this.horarioSeleccionado = null;
    this.formularioHorario = { diaSemana: '', horaInicio: '', horaFin: '' };
  }

  editarHorario(disp: any): void {
    this.modoEdicionHorario = true;
    this.horarioSeleccionado = disp;
    this.formularioHorario = {
      diaSemana: disp.diaSemana,
      horaInicio: disp.horaInicio,
      horaFin: disp.horaFin,
    };
    this.cd.detectChanges();
  }

  guardarHorario(): void {
    const payload = {
      medico: { id: this.medicoHorarios.id },
      diaSemana: this.formularioHorario.diaSemana,
      horaInicio: this.formularioHorario.horaInicio,
      horaFin: this.formularioHorario.horaFin,
    };

    if (this.modoEdicionHorario) {
      this.disponibilidadService.actualizar(this.horarioSeleccionado.id, payload).subscribe({
        next: () => { this.cargarDisponibilidades(); this.nuevoHorario(); },
      });
    } else {
      this.disponibilidadService.crear(payload).subscribe({
        next: () => { this.cargarDisponibilidades(); this.nuevoHorario(); },
      });
    }
  }

  eliminarHorario(id: number): void {
    if (confirm('¿Eliminar este horario?')) {
      this.disponibilidadService.eliminar(id).subscribe({
        next: () => this.cargarDisponibilidades(),
      });
    }
  }

  cerrarHorarios(): void {
  this.medicoHorarios = null;
  this.disponibilidades = [];
}
}
