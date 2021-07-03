import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuperGuard } from '../auth/guards/super.guard';
import { AprobarComponent } from './publicacion/aprobar/aprobar.component';
import { ComentarioComponent } from './publicacion/comentario/comentario/comentario.component';
import { PublicacionComponent } from './publicacion/publicacion.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: PublicacionComponent, pathMatch: 'full' },
      { path: 'aprobar', component: AprobarComponent, pathMatch: 'full', canActivate: [SuperGuard] },
      {
        path: ':id',
        children: [
          { path: '',  component: ComentarioComponent, pathMatch: 'full'},
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicacionRoutingModule { }
