
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

import { tap, map, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class RequireAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {

    return this.auth.currentUser.pipe(
      take(1),
      map(user => user ? true : false),
      tap(canView => {
        if (!canView) {
          this.router.navigate(['/publicacion']);
          console.error('Access denied. Must have permission to view content');
        }
      })
    );
  }
}
