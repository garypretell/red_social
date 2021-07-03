import { Injectable } from '@angular/core'; // imports the class that provides local storage for token
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, filter, take, switchMap } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthInterceptorService implements HttpInterceptor {
  constructor(private route: ActivatedRoute,
    private router: Router, private cookieService: CookieService, private auth: AuthService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token: string = this.cookieService.get('token'); 
    console.log(token)
    req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
    req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error && error.status === 401) {
            console.log("ERROR 401 UNAUTHORIZED")
            this.auth.signOut();
            this.router.navigate(['login']);
          }
          if (error && error.status === 400) {
            console.log("ERROR 401 UNAUTHORIZED") 
            this.auth.signOut();
            this.router.navigate(['login']);
          }
          const err = error.error.message || error.statusText;
          return throwError(error);                  
        })
      );
  }
}