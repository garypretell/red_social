import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-repositorio',
  templateUrl: './repositorio.component.html',
  styleUrls: ['./repositorio.component.css']
})
export class RepositorioComponent implements OnInit, OnDestroy {
  page = 12;
  imagenes = this.storageService.imagenes;

  showGoUpButton = false;
  private hideScrollHeight = 200;

  private showScrollHeight = 500;
  constructor(@Inject(DOCUMENT) private document:Document, public storageService: StorageService) { }
  ngOnDestroy(): void {
    this.storageService.unsubscribeImagen();
  }

  ngOnInit(): void {
    this.storageService.loadImagenes();
    this.storageService.listenAll();
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

  descargar(item: any): any {
    this.storageService.download('avatars', item.file_name).then(data =>{
      let url = window.URL.createObjectURL(data.data);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = item.file_name;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }).catch(err => console.log(err));

  }

  onScrollDown(e: any): any {
    this.storageService.dataTable(this.page, this.page + 11).then(data => {
    }).catch(err => console.log(err));
    this.page += 12;
  }

  onScrollTop():void{
    this.document.body.scrollTop = 0; // Safari
    this.document.documentElement.scrollTop = 0; // Other
  }

}
