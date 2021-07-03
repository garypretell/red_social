import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Paciente } from './shared/models/paciente.model';
import { PacienteService } from './shared/services/paciente.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'odonto';

  constructor(
    public pacienteService: PacienteService, public auth: AuthService
  ) {

  }
   ngOnInit(): void {
   
  }
}
