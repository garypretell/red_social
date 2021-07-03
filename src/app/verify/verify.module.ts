import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyComponent } from './verify/verify.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyRoutesModule } from './verify.route';



@NgModule({
  declarations: [
    VerifyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VerifyRoutesModule
  ]
})
export class VerifyModule { }
