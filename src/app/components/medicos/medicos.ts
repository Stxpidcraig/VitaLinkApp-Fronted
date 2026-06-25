import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../../services/medico';
import { EspecialidadService } from '../../services/especialidad';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicos.html',
  styleUrl: './medicos.css',
})
export class MedicosComponent implements OnInit {
  medicos: any[] = [];
  especialidades:any[] = [];
  medicoSeleccionado: any = null;
  modoEdicion: boolean = false;

  formulario = {
    nombres: '',
    apellidos: '',
    telefono: '',
    correo: '',
    especialidadId: null as any,
  };

  constructor(private medicoService: MedicoService, private especialidadService: EspecialidadService, private cd: ChangeDetectorRef) {}

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
      next: (data) => {
      this.medicos = [...data];
      this.cd.detectChanges();
    },
      error: (err) => console.error(err),
    });
  }

  limpiarBuscador(): void {
  this.busqueda = '';
  this.busquedaEspecialidad = '';
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
      especialidadId: medico.especialidad?.id
    };
    this.cd.detectChanges();
  }

  guardar(): void {
    const payload = {
      nombres: this.formulario.nombres,
      apellidos: this.formulario.apellidos,
      telefono: this.formulario.telefono,
      correo: this.formulario.correo,
      especialidad: this.formulario.especialidadId ? { id: this.formulario.especialidadId } : null
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
    if (confirm('¿Estás seguro de eliminar este médico?')) {
      this.medicoService.eliminar(id).subscribe({
        next: () => this.listar(),
      });
    }
  }

  busqueda: string = '';
  busquedaEspecialidad: string = '';

  get medicosFiltrados(): any[] {
  return this.medicos.filter(m =>
    (m.nombres.toLowerCase().includes(this.busqueda.toLowerCase()) ||
    m.apellidos.toLowerCase().includes(this.busqueda.toLowerCase())) &&
    m.especialidad?.nombre.toLowerCase().includes(this.busquedaEspecialidad.toLowerCase())
  );
  }

}
