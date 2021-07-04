import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Comentario } from 'src/app/shared/models/comentario.model';
import { FileInfo } from 'src/app/shared/models/fileInfo.model';
import { ComentarioService } from 'src/app/shared/services/comentario.service';
import { PublicacionService } from 'src/app/shared/services/publicacion.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import Swal from "sweetalert2";
declare var $: any;

@Component({
  selector: 'app-publicacion',
  templateUrl: './publicacion.component.html',
  styleUrls: ['./publicacion.component.css']
})
export class PublicacionComponent implements OnInit, OnDestroy {
  page = 5;
  @ViewChild('file') file!: ElementRef;
  public publicacionForm!: FormGroup;
  publicaciones = this.publicacionService.publicaciones;
  public imagePath: any;
  validateYoutube = false;
  youtubeShow = false;
  youtubeURL: any;
  imgURL: any;
  imagen: any;
  message: any;
  status = false;
  comentario: any = 'I. El ataque de Satanás contra Job. Job (1:1 al 2:10) \nII. Job y sus amigos. Job (2:11 al 31:40) III. El mensaje de Eliú. Job (32 al 37) IV. Diagnóstico divino de Job. Job (38 al 42:6) V. Bendición de Job. Job (42:7-17)';

  showGoUpButton = false;
  private hideScrollHeight = 200;

  private showScrollHeight = 500;
  constructor(@Inject(DOCUMENT) private document:Document, private storageService: StorageService, public formBuilder: FormBuilder, private dom: DomSanitizer, public router: Router,
    public auth: AuthService, public publicacionService: PublicacionService, public comentarioService: ComentarioService) {
    this.publicacionForm = this.formBuilder.group({
      comentario: ['', [Validators.required]],
      youtube: ['']
    });
  }
  ngOnDestroy(): void {
    this.publicacionService.unsubscribePublicacion();
  }

  async ngOnInit(): Promise<void> {
    this.publicacionService.loadPublicaciones();
    this.publicacionService.listenAll();
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

  mostrarModal(): any {
    this.imgURL = null;
    this.youtubeURL = null;
    this.youtubeShow = false;
    this.publicacionForm.reset();
    $('#myModal').modal('show');
  }

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length == 0) {
      this.message = 'You must select an image to upload.';
      return;
    }

    const file: File = input.files[0];
    const name = file.name.replace(/ /g, '');
    const info: FileInfo = {
      private: false,
      title: name
    }

    this.storageService.uploadFile(info, file).then((data) => {
      console.log(data.data);
    }).catch((err) => console.log(err));
  }

  preview(files: any) {
    this.imagen = files[0];
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  openFile(): any {
    this.imgURL = null;
    this.file.nativeElement.click();
  }

  showLink(): any {
    this.publicacionForm.controls['youtube'].setValue(null);
    this.youtubeShow = !this.youtubeShow;
    this.validateYoutube = false;
    this.youtubeURL = null;
  }

  limpiarFoto(): any {
    this.imgURL = null;
  }

  youtubeLink(e: any): any {
    if (e) {
      const link = e.target.value;
      this.validateYoutube = link.includes('watch?v=') ? true : false
      if (this.validateYoutube) {
        const validar = link.includes('&') ? true : false
        if (validar) {
          const temp = link.replace("watch?v=", "embed/").slice(0, link.replace("watch?v=", "embed/").indexOf("&"))
          this.youtubeURL = temp;
        } else {
          const temp = link.replace("watch?v=", "embed/");
          this.youtubeURL = temp;
        }
      }
    }
  }

  async publicar(): Promise<any> {
    const user = await this.auth.getUser();
    if (this.imagen) {
      this.storageService.uploadFile(user.uid, this.imagen).then((data) => {
        if (data) {
          const publicacion: any = {
            displayName: user.displayName,
            avatar: user.avatar,
            message: this.publicacionForm.get('comentario')!.value,
            imgURL: data.data[0].image_url,
            youtubeURL: this.youtubeURL,
            date: Date.now(),
            comentarios: 0,
            likes: 0,
            compartir: 0,
            estado: 1
          }
          this.publicacionService.addPublicacion(publicacion).then((data) => {
          }).catch((err) => console.log(err));
        }
      }).catch((err) => console.log(err));
    } else {
      const publicacion: any = {
        displayName: user.displayName,
        avatar: user.avatar,
        message: this.publicacionForm.get('comentario')!.value,
        imgURL: null,
        youtubeURL: this.youtubeURL,
        date: Date.now(),
        comentarios: 0,
        likes: 0,
        compartir: 0,
        estado: 1
      }
      this.publicacionService.addPublicacion(publicacion).then((data) => {
      }).catch((err) => console.log(err));
    }
    $('#myModal').modal('hide');
  }

  goComentario(p: any): any {
    const comentario: Comentario = {
      parentId: 0,
      nickname: p.displayName,
      avatar: p.avatar,
      content: p.message,
      date: Date.now(),
      publicacionId: p.id
    }
    this.comentarioService.findComentario(comentario).then(data => {
      if(data.data.length > 0) {
        this.router.navigate(['/publicacion', p.id]);
        return;
      }else{
        this.comentarioService.addComentario(comentario);
        this.router.navigate(['/publicacion', p.id]);
        return;
      }
    });
  }

  async addLike(p: any): Promise<any> {
    const user = await this.auth.getUser();
    if(user){
      this.publicacionService.incrementarLike(user.id, p.id);
    }else {
      Swal.fire(
        'No ha iniciado sesión',
        'Registrese e inicie sesión para empezar!',
        'info'
      )
    }
    
  }

  onScrollDown(e: any): any {
    this.publicacionService.dataTable(this.page, this.page + 4).then(data => {
    }).catch(err => console.log(err));
    this.page += 5;
  }

  onScrollTop():void{
    this.document.body.scrollTop = 0; // Safari
    this.document.documentElement.scrollTop = 0; // Other
  }

  eliminarPublicacion(p: any): any {
    Swal.fire({
      title: 'Esta seguro de Eliminar esta publicación?',
      text: "no podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicacionService.deletePublicacion(p.id);
        Swal.fire(
          'Eliminado!',
          'La Publicación ha sido eliminada.',
          'success'
        )
      }
    })
  }

  async editarPublicacion(p: any) {
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputValue: p.message,
      inputLabel: 'Editar Publicación',
      inputPlaceholder: 'Editar Publicación...',
      inputAttributes: {
        'aria-label': 'Editar Publicación'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    })
    
    if (text) {
      p.message = text;
      this.publicacionService.update(p.id, p);
      Swal.fire(
        'Publicación',
        'La publicación ha sido actualizada!',
        'info'
      )
    }
  }

}
