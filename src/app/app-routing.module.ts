import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, RequireUnauthGuard, SuperGuard } from './auth/guards';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule),
    canActivate: [RequireUnauthGuard]
  },
  {
    path: '',
    redirectTo: 'publicacion',
    pathMatch: 'full'
  },
  {
    path: 'paciente',
    loadChildren:  () => import('./paciente/paciente.module').then( m => m.PacienteModule)
  },
  {
    path: 'publicacion',
    loadChildren:  () => import('./publicacion/publicacion.module').then( m => m.PublicacionModule)
  },
  {
    path: 'registrar',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./verify/verify.module').then(m => m.VerifyModule)
  },
  {
    path: 'repositorio',
    loadChildren: () => import('./repositorio/repositorio.module').then(m => m.RepositorioModule), canActivate: [AdminGuard]
  },
  {
    path: 'usuario',
    loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule), canActivate: [SuperGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
