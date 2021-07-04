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
    await this.publicacionService.loadPublicacionesAprobar();
    await this.publicacionService.listenAllAprobar();
  }

  async aprobarPublicacion(item: any): Promise<any> {
    const pubEdit = await this.publicacionService.publicacionId(item.id);
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
        pubEdit.estado = +1;
        pubEdit.date = +Date.now();
        this.publicacionService.update(pubEdit.id, pubEdit);
        Swal.fire(
          'Aprobado!',
          'La publicación ha sido aprobada.',
          'success'
        )
      }
    })
  }

  async rechazarPublicacion(item: any): Promise<any> {
    const pubEdit = await this.publicacionService.publicacionId(item.id);
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
        pubEdit.estado = +2;
        pubEdit.date = +Date.now();
        this.publicacionService.update(pubEdit.id, pubEdit);
        Swal.fire(
          'Rechazado!',
          'La publicación ha sido rechazada.',
          'success'
        )
      }
    })
  }

}
