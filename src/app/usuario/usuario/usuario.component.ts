import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import Swal from "sweetalert2";
declare const $: any;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, OnDestroy {
  usuarioB: any;
  resultado: any = false;
  dni: any = [];
  page = 10;
  usuario: any;
  subscriber: any;
  editor: any;
  admin: any;
  super: any;
  idx: any
  usuarios = this.auth.usuarios;
  searchObject: any = {};
  showGoUpButton = false;
  private hideScrollHeight = 200;

  private showScrollHeight = 500;
  constructor(@Inject(DOCUMENT) private document:Document, public auth: AuthService) { }

  ngOnDestroy(): void {
    this.auth.unsubscribeUser();
  }

  ngOnInit(): void {
    this.auth.listenAll();
    this.auth.loadUsuarios();
    
  }

  @HostListener('window:scroll', [])
  onWindowScroll():void {
    const yOffSet = window.pageYOffset;
    if ((yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) > this.showScrollHeight) {
      this.showGoUpButton = true;
    } else if (this.showGoUpButton && (yOffSet || this.document.documentElement.scrollTop || this.document.body.scrollTop) < this.hideScrollHeight) {
      this.showGoUpButton = false;
    }
  }

  async editUsuario(usuario: any) {
    this.usuario = await this.auth.usuarioId(usuario.id);
    this.idx = this.usuario.id;
    this.subscriber = this.usuario.roles.subscriber;
    this.editor = this.usuario.roles.editor;
    this.admin = this.usuario.roles.admin;
    this.super = this.usuario.roles.super;
    $('#editModal').modal("show");
  }

  deleteUsusario(usuario: any): any {
    Swal.fire({
      title: "Esta seguro de eliminar este usuario?",
      text: "No podrás revertir este proceso!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then(async (result) => {
      if (result.value) {
        // this.auth.de(usuario._id);
        Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");
      }
    });
  }

  async updateUsuario(): Promise<any> {
    const roles: any = {
        admin: this.admin,
        editor: this.editor,
        subscriber: this.subscriber,
        super: this.super,
    };
    this.usuario.roles = roles;
    await this.auth.update(this.idx, this.usuario);
    $('#editModal').modal("hide");
  }


  onScrollDown(e: any): any {
    this.auth.dataTable(this.page, this.page + 9).then(data => {
    }).catch(err => console.log(err));
    this.page += 10;
  }

  onScrollTop():void{
    this.document.body.scrollTop = 0; // Safari
    this.document.documentElement.scrollTop = 0; // Other
  }

  public onRemove(item: any) {
    this.resultado = false;
    this.searchObject = {}
  }

  async buscarUduarioxDNI(e: any): Promise<any> {
    this.resultado = true;
    this.dni = [];
    this.usuarioB = null;
    this.dni.push({id: 1, dni: e.target.value});
    const user = await this.auth.usuarioDNI(e.target.value);
    if(user){
      this.usuarioB = user;
    }else{
      this.usuarioB = null;
    }
  }

}
