
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutesModule } from './auth.routes';

// import { RequireAuthGuard, RequireUnauthGuard, AdminGuard, EditorGuard, AuthGuard, SuperGuard } from './guards';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuard, RequireUnauthGuard } from './guards';


@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutesModule  ],
  providers: [ ]
})
export class AuthModule { }
