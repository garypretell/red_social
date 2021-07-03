import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Paciente } from 'src/app/shared/models/paciente.model';
import { PacienteService } from 'src/app/shared/services/paciente.service';
import { PacienteModalComponent } from '../paciente-modal/paciente-modal.component';
import Swal from "sweetalert2";

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  @ViewChild(PacienteModalComponent) child!: PacienteModalComponent;
  paciente: any;
  pacientes = this.pacienteService.pacientes;
  @ViewChild('demoModal') demoModal: any;
  constructor(
    public pacienteService: PacienteService,
    public router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.pacienteService.listenAll();
    await this.pacienteService.loadPacientes();
  }

  edit(row: any): any {
    this.child.paciente = row;
    this.child.modal();
  }


  open(): any {
    this.child.paciente = {};
    this.child.modal();
  }

  goOptions(row: any): any {
    this.paciente = row;
    this.router.navigate(['/paciente', row.id]);
  }

  delete(row: any): any {
    Swal.fire({
      title: "Esta seguro de eliminar este Paciente?",
      text: "No podrás revertir este proceso!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then(async (result) => {
      if (result.value) {
        await this.pacienteService.deletePaciente(row.id).then(() => {
          Swal.fire("Eliminado!", "El paciente ha sido eliminado.", "success");
        }).catch((error) => console.log(error));
        
      }
    });
  }
}
