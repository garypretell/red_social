import { Component, OnInit, ViewChild } from '@angular/core';
import { PacienteService } from 'src/app/shared/services/paciente.service';
import { BaseFormPaciente } from 'src/app/shared/utils/base-form-paciente';
import Swal from "sweetalert2";
declare var $: any;

enum Action {
  EDIT = 'edit',
  NEW = 'new',
}
@Component({
  selector: 'app-paciente-modal',
  templateUrl: './paciente-modal.component.html',
  styleUrls: ['./paciente-modal.component.css']
})
export class PacienteModalComponent implements OnInit {
  userID: any;
  tittle: any;
  paciente: any;
  actionTODO = Action.NEW;
  constructor(
    public pacienteForm: BaseFormPaciente,
    public pacienteService: PacienteService,

  ) { }

  ngOnInit(): void {
  }

  private pathFormData(): void {
    this.pacienteForm.baseForm.patchValue({
      nombres: this.paciente?.nombres,
      apellidos: this.paciente?.apellidos,
      sexo: this.paciente?.sexo,
      dni: this.paciente?.dni,
      estadoCivil: this.paciente?.estadoCivil,
      fechaNacimiento: this.paciente?.fechaNacimiento,
      celular: this.paciente?.celular,
      correo: this.paciente?.correo,
      direccion: this.paciente?.direccion,
      observacion: this.paciente?.observacion,
      estado: this.paciente?.estado
    });
  }

  modal(): any {
    if (this.paciente?.hasOwnProperty('id')) {
      this.tittle = 'Editar Paciente';
      this.actionTODO = Action.EDIT;
      this.pacienteForm.baseForm.updateValueAndValidity();
      this.pathFormData();
    } else {
      this.actionTODO = Action.NEW;
      this.tittle = 'Registrar Paciente';
      this.pacienteForm.baseForm.reset();
    }
    $('#myModal').modal('show');
  }

  close(): any {
    $('#myModal').modal('hide');
  }

  save(): void {
    if (this.paciente?.hasOwnProperty('id')) {
     this.update();
    } else {
      this.add();
    }

  }

  async add(): Promise<any> {
    this.pacienteForm.baseForm.get('usuarioId')!.setValue(this.userID);
    this.pacienteService.addPaciente(this.pacienteForm.baseForm.value).then(() => {
      Swal.fire(
        'Paciente',
        'Registro exitoso!',
        'success'
      )
    }).catch((error) => console.log(error));
  }

  async update(): Promise<any> {
    this.pacienteForm.baseForm.get('usuarioId')!.setValue(this.userID);
    this.pacienteService.update(this.paciente.id, this.pacienteForm.baseForm.value).then(() => {
      Swal.fire(
        'Paciente',
        'Paciente Actualizado!',
        'success'
      )
    }).catch((error) => console.log(error));
  }

  get nombres(): any {
    return this.pacienteForm.baseForm.get('nombres');
  }

  get apellidos(): any {
    return this.pacienteForm.baseForm.get('apellidos');
  }

  get sexo(): any {
    return this.pacienteForm.baseForm.get('sexo');
  }

  get dni(): any {
    return this.pacienteForm.baseForm.get('dni');
  }

  get estadoCivil(): any {
    return this.pacienteForm.baseForm.get('estadoCivil');
  }

  get fechaNacimiento(): any {
    return this.pacienteForm.baseForm.get('fechaNacimiento');
  }

  get celular(): any {
    return this.pacienteForm.baseForm.get('celular');
  }

  get correo(): any {
    return this.pacienteForm.baseForm.get('correo');
  }

  get direccion(): any {
    return this.pacienteForm.baseForm.get('direccion');
  }

  get observacion(): any {
    return this.pacienteForm.baseForm.get('observacion');
  }

}
