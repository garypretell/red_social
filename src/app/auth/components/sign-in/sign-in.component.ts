import { AuthService } from '../../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from "sweetalert2";

@Component({
  selector: 'app-sign-in',
  styleUrls: ['./sign-in.component.css'],
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): any {

  }

  async login(): Promise<any> {

    try {
      const user =
        await this.authService.signIn(this.credentials.value);
      if (user) {
        this.router.navigate(['publicacion']);
      }
    } catch (error) {
      if(error.message === "Email not confirmed"){
        Swal.fire(
          'Inicio de Sesión',
          'Debe de confirmar su correo electrónico!',
          'info'
        )
      }else{
        console.log('Error', error);
      }
      
    }
  }

  private redirectUser(isVerified: boolean): void {
    if (isVerified) {
      this.router.navigate(['publicacion']);
    } else {
      this.router.navigate(['verify-email']);
    }
  }

  async signUp(): Promise<any> {
    // this.authService.signUp(this.credentials.value, {displayName: 'Carlos Pretell'}).then(async (data) => {
    //   console.log('Signup success', 'Please confirm your email now!');
    // },
    // async (err) => {
    //   console.log(err);
    // });
  }
}
