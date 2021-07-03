import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { first, map } from 'rxjs/operators';
import { User } from './user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import Swal from "sweetalert2";
import { LiteralPrimitive } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  subscriptionUser: any;
  subscriptionUsuarios: any;
  private _usuarios = new BehaviorSubject<User[]>([]);
  _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  user$: Observable<any> | undefined;

  private supabase: SupabaseClient;

  constructor(private router: Router, public jwtHelper: JwtHelperService, private cookieService: CookieService,) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      // {
      //   autoRefreshToken: true,
      //   persistSession: true,
      // }
    );

    this.supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const user = await this.usuario(session?.user?.id);
        this.user$ = of(user);
        this._currentUser.next(user);
        this.checkToken()
      } else {
        this.user$ = of(null);
        this._currentUser.next(false);
        // this.signOut();
      }
    });
  }

  get usuarios(): Observable<User[]> {
    return this._usuarios.asObservable();
  }

  async loadUsuarios(): Promise<any> {
    const query: any = await this.supabase
      .from<User>('user')
      .select('*')
      .limit(10);
    return this._usuarios.next(query.data);
  }

  async dataTable(init: number, end: number): Promise<any> {
    const { data, error } = await this.supabase
      .from<User>('user')
      .select('*')
      .range(init, end);
    if (error) console.error(error)
    else {
      if (data!.length > 0) {
        this._usuarios.next([...this._usuarios.value, ...data! ]);
      }
    }
    return { data, error };
  }

  private checkToken(): void {
    const token = this.cookieService.get('token');
    const isExpired = this.jwtHelper.isTokenExpired(token);
    if (isExpired) {
      Swal.fire(
        'Sesión Expirada!',
        'Inicie sesión nuevamente!',
        'info'
      )
      this.signOut().then(() => {
        this.router.navigateByUrl('/login');
      });

    }
  }

  async usuario(uid: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('user')
      .select('*')
      .match({ uid })
      .single();
    return data;
  }

  getUser$(): any {
    return this.user$?.pipe(first()).toPromise();
  }

  isEmailVerified(user: any): boolean {
    return user.confirmed_at ? true : false;
  }

  get currentUser(): Observable<User> {
    return this._currentUser.asObservable();
  }

  getUser(): any {
    return this.currentUser.pipe(first()).toPromise();
  }

  async signUp(usuario: any): Promise<any> {
    const credentials = { email: usuario.email, password: usuario.password }
    return new Promise(async (resolve, reject) => {
      const { error, data } = await this.supabase.auth.signUp(credentials);
      if (error) {
        reject(error);
      } else {
        this.createUserData(data, usuario);
        resolve(data);
      }
    });
  }

  signIn(credentials: { email: any; password: any }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const { error, data } = await this.supabase.auth.signIn(credentials);
      if (error) {
        reject(error);
      } else {
        const token: any = data?.access_token;
        this.cookieService.set('token', token);
        resolve(data);
      }
    });
  }

  async signOut(): Promise<any> {
    this.user$ = of(null);
    this._currentUser.next(false);
    await this.supabase.auth.signOut().then((_) => {
      // Clear up and end all active subscriptions!
      this.supabase.getSubscriptions().map((sub) => {
        this.supabase.removeSubscription(sub);
      });
      this.router.navigateByUrl('/');
    });
  }

  private async createUserData(user: any, usuario: any) {
    const usuarioCreate: any = {
      lastSesion: Date.now(),
      uid: user.id,
      displayName: usuario.displayName,
      email: user.email,
      dni: usuario.dni,
      estado: true,
      avatar: 'https://png.pngtree.com/png-vector/20191104/ourmid/pngtree-businessman-avatar-cartoon-style-png-image_1953664.jpg',
      roles: {
        subscriber: true,
        editor: true,
        admin: false,
        super: false
      }
    };

    const { data, error } = await this.supabase
      .from<User>('user')
      .insert(usuarioCreate);
    return { data, error };

    // return usuarioRef.set(data);
  }

  async usuarioId(id: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('user')
      .select('*')
      .match({ id })
      .single();
    return data;
  }

  async usuarioDNI(dni: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('user')
      .select('*')
      .match({ dni })
      .single();
    return data;
  }

  async update(id: any, usuario: User): Promise<any> {
    const { data, error } = await this.supabase
      .from('user')
      .update(usuario)
      .match({ id });
  }


  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber', 'super'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor', 'super'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ['admin', 'super'];
    return this.checkAuthorization(user, allowed);
  }

  canSuper(user: User): boolean {
    const allowed = ['super'];
    return this.checkAuthorization(user, allowed);
  }

  private checkAuthorization(user: User, allowedRoles: any[]): boolean {
    // tslint:disable-next-line:curly
    if (!user) return false;
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }


  listenAll(): any {
    this.subscriptionUser = this.supabase
      .from('user')
      .on('*', async (payload) => {
        if (payload.eventType === 'DELETE') {
          // Filter out the removed item
          const oldItem: User = payload.old;
          const newValue = this._currentUser.value;
          this._currentUser.next(newValue);
        } else if (payload.eventType === 'INSERT') {
          // Add the new item
          // const newItem: User = payload.new;
          // this._currentUser.next([newItem, ...this._currentUser.value]);
        } else if (payload.eventType === 'UPDATE') {
          // Update one item
          const updatedItem: User = payload.new;
          const foundIndex = this._usuarios.value.findIndex(x => x.id == updatedItem.id);
          this._usuarios.value[foundIndex] = updatedItem;
          const newValue = this._currentUser.value;
          const user = await this.usuario(newValue.uid);
          this.user$ = of(user);
          this._currentUser.next(user);
          
        }
      })
      .subscribe();
    return this.subscriptionUser;
  }

  unsubscribeUser(): any {
    this.supabase.removeSubscription(this.subscriptionUser);
  }

}
