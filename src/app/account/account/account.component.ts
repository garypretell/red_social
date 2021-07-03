import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  checkBoxValue: boolean;
  validarCodigos: boolean;
  proyecto: any;
  proyectoN: any;
  sedeN: any;
  sede: any;
  public accountForm: FormGroup;
  constructor(
    public router: Router,
    public auth: AuthService,
    public formBuilder: FormBuilder,
  ) {
    this.checkBoxValue = false;
    this.validarCodigos = false;
    this.accountForm = this.formBuilder.group({
      displayName: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {

  }

  postSignIn(): void {
    this.router.navigate(['publicacion']);
  }

  async onRegister() {

    try {
      const user =
        await this.auth.signUp(this.accountForm.value);
      if (user) {
        const isVerified = this.auth.isEmailVerified(user);
        this.redirectUser(isVerified);
      }
    } catch (error) {
      console.log('Error', error);
    }

  }

  private redirectUser(isVerified: boolean): void {
    if (isVerified) {
      this.router.navigate(['publicacion']);
    } else {
      this.router.navigate(['verify-email']);
    }
  }

}