import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicacionComponent } from './publicacion/publicacion.component';
import { PublicacionRoutingModule } from './publicacion-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { ComentarioComponent } from './publicacion/comentario/comentario/comentario.component';
import { ComentarioBoxComponent } from './publicacion/comentario/comentario-box/comentario-box.component';
import { ComentarioDetailComponent } from './publicacion/comentario/comentario-detail/comentario-detail.component';
import { AppSafePipe } from '../shared/pipes/appSafe.pipe';
import { SaltoPipe } from '../shared/pipes/salto.pipe';
import { AprobarComponent } from './publicacion/aprobar/aprobar.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollableDirective } from '../shared/directive/scrollable.directive';

@NgModule({
  declarations: [
    PublicacionComponent,
    ComentarioComponent,
    ComentarioBoxComponent,
    ComentarioDetailComponent,
    AppSafePipe,
    SaltoPipe,
    AprobarComponent,
    ScrollableDirective
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, PublicacionRoutingModule, MomentModule, InfiniteScrollModule
  ],
  providers: [ ],
})
export class PublicacionModule { }
