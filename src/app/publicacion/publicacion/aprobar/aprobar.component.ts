import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';
import { PublicacionService } from 'src/app/shared/services/publicacion.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-aprobar',
  templateUrl: './aprobar.component.html',
  styleUrls: ['./aprobar.component.css']
})
export class AprobarComponent implements OnInit, OnDestroy {
  publicacionesAprobar = this.publicacionService.publicacionesAprobar;
  constructor(private storageService: StorageService, public formBuilder: FormBuilder, private dom: DomSanitizer,
    public auth: AuthService, public publicacionService: PublicacionService) { }
    
  ngOnDestroy(): void {
    this.publicacionService.unsubscribePublicacionAprobar();
  }

  async ngOnInit(): Promise<void> {
    this.publicacionService.loadPublicacionesAprobar();
    this.publicacionService.listenAllAprobar();
  }

  aprobarPublicacion(item: any): any {
    Swal.fire({
      title: 'Esta seguro de aprobar esta publicación?',
      text: "Aprobar Publicación...",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aprobar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        item.estado = 1;
        item.date = Date.now();
        this.publicacionService.update(item.id, item);
        Swal.fire(
          'Aprobado!',
          'La publicación ha sido aprobada.',
          'success'
        )
      }
    })
  }

  rechazarPublicacion(item: any): any {
    Swal.fire({
      title: 'Esta seguro de rechazar esta publicación?',
      text: "Rechazar Publicación...",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Rechazar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        item.estado = 2;
        item.date = Date.now();
        this.publicacionService.update(item.id, item);
        Swal.fire(
          'Rechazado!',
          'La publicación ha sido rechazada.',
          'success'
        )
      }
    })
  }

}
