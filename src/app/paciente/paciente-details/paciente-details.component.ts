import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PacienteService } from 'src/app/shared/services/paciente.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-paciente-details',
  templateUrl: './paciente-details.component.html',
  styleUrls: ['./paciente-details.component.css']
})
export class PacienteDetailsComponent implements OnInit {
  private unsubscribe$ = new Subject();
  pacienteID: any;
  paciente: any;
  constructor(
    public pacienteService: PacienteService,
    public router: Router,
    public activatedroute: ActivatedRoute
  ) { }

   ngOnInit(): any {
    this.activatedroute.paramMap.pipe(map(async params => {
      this.pacienteID = params.get('id');
      this.paciente = await this.pacienteService.patientId(this.pacienteID);
    }), takeUntil(this.unsubscribe$)).subscribe();
    
  }

  exploracion(): any {
    this.router.navigate(['/paciente',this.pacienteID, 'exploracion-fisica']);
  }

  odontograma(): any {
    this.router.navigate(['/paciente',this.pacienteID, 'odontograma']);
  }

  diagnostico(): any {
    this.router.navigate(['/paciente',this.pacienteID, 'diagnostico']);
  }

  evolucion(): any {
    this.router.navigate(['/paciente',this.pacienteID, 'evolucion']);
  }

  placas(): any {
    this.router.navigate(['/paciente',this.pacienteID, 'placas']);
  }

  tratamientos(): any {
    this.router.navigate(['/paciente',this.pacienteID, 'tratamientos']);
  }

  receta(): any {
    this.router.navigate(['/paciente',this.pacienteID, 'receta']);
  }

  citas(): any {
    this.router.navigate(['/paciente',this.pacienteID, 'citas']);
  }

}
