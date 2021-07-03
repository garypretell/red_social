import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  constructor(public router: Router, public auth: AuthService) { }

  ngOnInit(): void {
  }

  goInicio() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

}
