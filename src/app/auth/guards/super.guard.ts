import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SuperGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth._currentUser.pipe(
      take(1),
      map((user: any) => user && user.roles.super ? true : false),
      tap(isSuper => {
        if (!isSuper) {
          this.router.navigate(['/publicacion']);
          console.error('Access denied - SuperAdmins only');
        }
      })
    );
  }
}
