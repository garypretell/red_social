import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteComponent } from './paciente/paciente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PacienteDetailsComponent } from './paciente-details/paciente-details.component';
import { PacienteRoutingModule } from './paciente-routing.module';
import { PacienteModalComponent } from './paciente-modal/paciente-modal.component';
import { ExploracionFisicaComponent } from './exploracion-fisica/exploracion-fisica.component';
import { OdontogramaComponent } from './odontograma/odontograma.component';
import { DiagnosticoComponent } from './diagnostico/diagnostico.component';
import { EvolucionComponent } from './evolucion/evolucion.component';
import { PlacasComponent } from './placas/placas.component';
import { TratamientosComponent } from './tratamientos/tratamientos.component';
import { RecetaComponent } from './receta/receta.component';
import { CitasComponent } from './citas/citas.component';
import { MyDatePickerModule } from 'mydatepicker';
import { EnfermedadActualComponent } from './exploracion-fisica/enfermedad-actual/enfermedad-actual.component';
import { ConsultaSaludComponent } from './exploracion-fisica/consulta-salud/consulta-salud.component';
import { ExploracionComponent } from './exploracion-fisica/exploracion/exploracion.component';
import { AlergiasComponent } from './exploracion-fisica/alergias/alergias.component';

@NgModule({
  declarations: [
    PacienteComponent,
    PacienteDetailsComponent,
    PacienteModalComponent,
    ExploracionFisicaComponent,
    OdontogramaComponent,
    DiagnosticoComponent,
    EvolucionComponent,
    PlacasComponent,
    TratamientosComponent,
    RecetaComponent,
    CitasComponent,
    EnfermedadActualComponent,
    ConsultaSaludComponent,
    ExploracionComponent,
    AlergiasComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, PacienteRoutingModule
  ]
})
export class PacienteModule { }
