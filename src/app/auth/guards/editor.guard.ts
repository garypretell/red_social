import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { tap, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {

    return this.auth._currentUser.pipe(
      take(1),
      map((user: any) => user && user.roles.editor ? true : false),
      tap(isEditor => {
        if (!isEditor) {
          this.router.navigate(['/publicacion']);
          console.error('Access denied');
        }
      })
    );
  }
}
