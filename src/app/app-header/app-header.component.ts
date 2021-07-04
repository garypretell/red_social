import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PublicacionComponent } from '../publicacion/publicacion/publicacion.component';
import { FileInfo } from '../shared/models/fileInfo.model';
import { PublicacionService } from '../shared/services/publicacion.service';
import { StorageService } from '../shared/services/storage.service';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('file') file!: ElementRef;
  public publicacionForm!: FormGroup;
  usuario = this.auth.usuario;
  publicacionesAprobar = this.publicacionService.publicacionesAprobar;
  public imagePath: any;
  validateYoutube = false;
  youtubeShow = false;
  youtubeURL: any;
  imagen: any;
  imgURL: any;
  message: any;
  constructor(private storageService: StorageService, public auth: AuthService, public router: Router,
    public formBuilder: FormBuilder, private dom: DomSanitizer, public publicacionService: PublicacionService) {

    this.publicacionForm = this.formBuilder.group({
      comentario: ['', [Validators.required]],
      youtube: ['']
    });
  }
  ngOnDestroy(): void {
    this.auth.unsubscribeUser();
  }

  async ngOnInit(): Promise<void> {
    this.auth.listenAll();

  }

  ngAfterViewInit() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  logOut(): any {
    this.auth.signOut();
  }

  logIn(): any {
    this.router.navigate(['login']);
  }

  registrar(): any {
    this.router.navigate(['registrar']);
  }

  repositorio(): any {
    this.router.navigate(['repositorio']);
  }

  publicacion(): any {
    $('#element').tooltip('hide')
    this.router.navigate(['publicacion']);
  }

  async historiaModal(): Promise<any> {
    $('#historia').tooltip('hide');
    this.imgURL = null;
    this.youtubeURL = null;
    this.youtubeShow = false;
    this.publicacionForm.reset();
    $('#myModal2').modal('show');
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
            uid: user.uid,
            displayName: user.displayName,
            avatar: user.avatar,
            message: this.publicacionForm.get('comentario')!.value,
            imgURL: data.data[0].image_url,
            youtubeURL: this.youtubeURL,
            date: Date.now(),
            comentarios: 0,
            likes: 0,
            compartir: 0,
            estado: 0
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
        estado: 0
      }
      this.publicacionService.addPublicacion(publicacion).then((data) => {
        // console.log('data');
      }).catch((err) => console.log(err));
    }
    $('#myModal2').modal('hide');
  }
}
