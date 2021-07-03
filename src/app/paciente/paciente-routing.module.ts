import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitasComponent } from './citas/citas.component';
import { DiagnosticoComponent } from './diagnostico/diagnostico.component';
import { EvolucionComponent } from './evolucion/evolucion.component';
import { ExploracionFisicaComponent } from './exploracion-fisica/exploracion-fisica.component';
import { OdontogramaComponent } from './odontograma/odontograma.component';
import { PacienteDetailsComponent } from './paciente-details/paciente-details.component';

import { PacienteComponent } from './paciente/paciente.component';
import { PlacasComponent } from './placas/placas.component';
import { RecetaComponent } from './receta/receta.component';
import { TratamientosComponent } from './tratamientos/tratamientos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: PacienteComponent, pathMatch: 'full' },
      {
        path: ':id',
        children: [
          { path: '',  component: PacienteDetailsComponent, pathMatch: 'full'},
          { path: 'exploracion-fisica',  component: ExploracionFisicaComponent},
          { path: 'odontograma',  component: OdontogramaComponent},
          { path: 'diagnostico',  component: DiagnosticoComponent},
          { path: 'evolucion',  component: EvolucionComponent},
          { path: 'placas',  component: PlacasComponent},
          { path: 'tratamientos',  component: TratamientosComponent},
          { path: 'receta',  component: RecetaComponent},
          { path: 'citas',  component: CitasComponent}
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
