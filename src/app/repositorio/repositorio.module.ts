import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepositorioComponent } from './repositorio/repositorio.component';
import { RepositorioRoutingModule } from './repositorio.route';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [
    RepositorioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RepositorioRoutingModule,
    InfiniteScrollModule
  ]
})
export class RepositorioModule { }
