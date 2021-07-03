import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';

import { tap, map, take, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private auth: AuthService, private router: Router) {}

  canLoad(): Observable<boolean> {
    return this.auth._currentUser.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        if (isAuthenticated) {          
          return true;
        } else { 
          this.auth.signOut();         
          this.router.navigateByUrl('/publicacion')
          return false;
        }
      })
    );
  }
}
