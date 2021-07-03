import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioRoutingModule } from './usuario.route';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  declarations: [
    UsuarioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UsuarioRoutingModule,
    InfiniteScrollModule,
    TagInputModule
  ]
})
export class UsuarioModule { }
