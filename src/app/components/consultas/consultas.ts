import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConsultaService } from '../../services/consulta';
import { CitasService } from '../../services/citas';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultas.html',
  styleUrl: './consultas.css',
})
export class ConsultasComponent implements OnInit {
  consultas: any[] = [];
  citas: any[] = [];
  seleccionada: any = null;
  modoEdicion = false;

  formulario = {
    citaId: null as any,
    medicoId: null as any,
    pacienteId: null as any,
    pesoKg: null as any,
    alturaCm: null as any,
    fechaAtencion: '',
    motivoConsulta: '',
    observaciones: '',
    diagnostico: { descripcion: '' },
    prescripcion: {
      medicamento: '',
      dosis: '',
      frecuencia: '',
      duracionDias: null as any,
    },
  };

  constructor(
    private consultaService: ConsultaService,
    private citasService: CitasService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  
    this.listarCitas();
  }

  listar(): void {
    this.consultaService.listar().subscribe({
      next: (data) => { this.consultas = [...data]; this.cd.detectChanges(); },
      error: (err) => console.error(err),
    });
  }

  listarCitas(): void {
    this.citasService.listar().subscribe({
    next: (data) => {
      this.citas = data;
      this.listar();
    },
    error: (err) => console.error(err),
  });
  }

  nuevo(): void {
    this.modoEdicion = false;
    this.seleccionada = null;
    this.formulario = {
      citaId: null, medicoId: null, pacienteId: null,
      pesoKg: null, alturaCm: null, fechaAtencion: '',
      motivoConsulta: '', observaciones: '',
      diagnostico: { descripcion: '' },
      prescripcion: { medicamento: '', dosis: '', frecuencia: '', duracionDias: null },
    };
  }

  editar(consulta: any): void {
    this.modoEdicion = true;
    this.seleccionada = consulta;
    this.formulario = {
      citaId: consulta.citaId,
      medicoId: consulta.medicoId,
      pacienteId: consulta.pacienteClinico?.pacienteId,
      pesoKg: consulta.pesoKg,
      alturaCm: consulta.alturaCm,
      fechaAtencion: consulta.fechaAtencion,
      motivoConsulta: consulta.motivoConsulta,
      observaciones: consulta.observaciones,
      diagnostico: { descripcion: consulta.diagnostico?.descripcion || '' },
      prescripcion: {
        medicamento: consulta.prescripcion?.medicamento || '',
        dosis: consulta.prescripcion?.dosis || '',
        frecuencia: consulta.prescripcion?.frecuencia || '',
        duracionDias: consulta.prescripcion?.duracionDias || null,
      },
    };
    this.cd.detectChanges();
  }

  guardar(): void {
    if (this.modoEdicion) {
      this.consultaService.actualizar(this.seleccionada.id, this.formulario).subscribe({
        next: () => { this.listar(); this.nuevo(); },
      });
    } else {
      this.consultaService.crear(this.formulario).subscribe({
        next: () => { this.listar(); this.nuevo(); },
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta consulta?')) {
      this.consultaService.eliminar(id).subscribe({
        next: () => this.listar(),
      });
    }
  }

onCitaSeleccionada(): void {
  const cita = this.citas.find(c => c.id === this.formulario.citaId);
  if (cita) {
    this.formulario.medicoId = cita.medico?.id;
    this.formulario.pacienteId = cita.paciente?.id;
    this.formulario.fechaAtencion = cita.fechaHora?.split('T')[0];
    this.formulario.motivoConsulta = cita.motivo;
    this.cd.detectChanges();
  }
}

getMedicoNombre(): string {
  const cita = this.citas.find(c => c.id === this.formulario.citaId);
  return cita ? `${cita.medico?.nombres} ${cita.medico?.apellidos}` : '';
}

getPacienteNombre(): string {
  const cita = this.citas.find(c => c.id === this.formulario.citaId);
  return cita ? `${cita.paciente?.nombres} ${cita.paciente?.apellidos}` : '';
}

getMedicoNombrePorCitaId(citaId: number): string {
  const cita = this.citas.find(c => c.id === citaId);
  return cita ? `${cita.medico?.nombres} ${cita.medico?.apellidos}` : citaId?.toString() ?? '-';
}

getPacienteNombrePorCitaId(citaId: number): string {
  const cita = this.citas.find(c => c.id === citaId);
  return cita ? `${cita.paciente?.nombres} ${cita.paciente?.apellidos}` : '-';
}
}