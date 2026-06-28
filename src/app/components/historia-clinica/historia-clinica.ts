import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ConsultaService } from '../../services/consulta';
import { CitasService } from '../../services/citas';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia-clinica.html',
  styleUrl: './historia-clinica.css',
})
export class HistoriaClinicaComponent implements OnInit {
  historia: any = null;
  pacienteId: number = 0;
  cargando = true;
  error = false;
  medicos: any[] = []; 

  constructor(
    private route: ActivatedRoute,
    private consultaService: ConsultaService,
    private citasService: CitasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.pacienteId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarMedicos();
  }

  cargarMedicos(): void {
  this.citasService.listar().subscribe({
    next: (citas) => {
      const medicosMap = new Map();
      citas.forEach(cita => {
        if (cita.medico) {
          medicosMap.set(cita.medico.id, cita.medico);
        }
      });
      this.medicos = Array.from(medicosMap.values());
      this.cargarHistoria();
    },
    error: () => this.cargarHistoria(),
  });
  }

  cargarHistoria(): void {
    this.cargando = true;
    this.error = false;

    this.consultaService.buscarHistoriaPorPaciente(this.pacienteId).subscribe({
      next: (data) => {
        this.historia = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.error = true;
      },
    });
  }

  getMedicoNombre(medicoId: number): string {
    const medico = this.medicos.find(m => m.id === medicoId);
    return medico ? `${medico.nombres} ${medico.apellidos}` : `Médico #${medicoId}`;
  }
}