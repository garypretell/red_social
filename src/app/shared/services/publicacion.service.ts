import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Publicacion } from '../models/publicacion.model';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  subscriptionPublicacion: any;
  private _publicaciones = new BehaviorSubject<Publicacion[]>([]);
  subscriptionPublicacionAprobar: any;
  private _publicacionesAprobar = new BehaviorSubject<Publicacion[]>([]);
  supabase: SupabaseClient;
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      // {
      //   autoRefreshToken: true,
      //   persistSession: true,
      // }
    );

    
    
  }
  get publicaciones(): Observable<Publicacion[]> {
    return this._publicaciones.asObservable();
  }

  get publicacionesAprobar(): Observable<Publicacion[]> {
    return this._publicacionesAprobar.asObservable();
  }

  async loadPublicaciones(): Promise<any> {
    const query: any = await this.supabase
      .from<Publicacion>('publicacion')
      .select('*')
      .filter('estado', 'eq', 1)
      .order('date', { ascending: false })
      .limit(5);
    return this._publicaciones.next(query.data);
  }

  async loadPublicacionesAprobar(): Promise<any> {
    const query: any = await this.supabase.from<Publicacion>('publicacion')
      .select('*')
      .filter('estado', 'eq', 0)
      .order('date', { ascending: false });
    return this._publicacionesAprobar.next(query.data);
  }

  async addPublicacion(publicacion: Publicacion): Promise<any> {
    const { data, error } = await this.supabase
      .from<Publicacion>('publicacion')
      .insert(publicacion);
    return { data, error };
  }

  async getPublicaciones(): Promise<any> {
    const { data: publicaciones, error } = await this.supabase
      .from<Publicacion>('publicacion')
      .select('*')
      .limit(10);
    return { publicaciones, error };
  }

  async dataTable(init: number, end: number): Promise<any> {
    const { data, error } = await this.supabase
      .from<Publicacion>('publicacion')
      .select('*')
      .filter('estado', 'eq', 1)
      .order('date', { ascending: false })
      .range(init, end);
    if (error) console.error(error)
    else {
      if (data!.length > 0) {
        this._publicaciones.next([...this._publicaciones.value, ...data! ]);
      }
    }
    
    return { data, error };

  }

  async publicacionId(id: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('publicacion')
      .select('*')
      .match({ id })
      .single();
    return data;
  }

  async deletePublicacion(id: any): Promise<any> {
    const data = await this.supabase.from('publicacion').delete().match({ id });
    return data;
  }

  async update(id: any, publicacion: Publicacion): Promise<any> {
    const { data, error } = await this.supabase
      .from('publicacion')
      .update(publicacion)
      .match({ id });
  }

  async incrementarComentario(id: number): Promise<any> {
    const { data, error } = await this.supabase
      .rpc('incrementarcomentarios', {
        row_id: id
      })
    if (error) console.error(error)
    else {
      
    }
  }

  async incrementarLike(uid: number, id: number): Promise<any> {
    const { data, error } = await this.supabase
      .rpc('incrementarlikes', {
        uid: uid,
        pid: id
      })
    if (error) console.error(error)
  }


  listenAll(): any {
    this.subscriptionPublicacion = this.supabase
      .from('publicacion')
      .on('*', (payload) => {
        if (payload.eventType === 'DELETE') {
          // Filter out the removed item
          const oldItem: Publicacion = payload.old;
          const newValue = this._publicaciones.value.filter(
            (item) => oldItem.id !== item.id
          );
          this._publicaciones.next(newValue);
        } else if (payload.eventType === 'INSERT') {
          // Add the new item
          const newItem: Publicacion = payload.new;
          if (newItem.estado == 1) {
            this._publicaciones.next([newItem, ...this._publicaciones.value]);
          }
        } else if (payload.eventType === 'UPDATE') {
          // Update one item
          const updatedItem: Publicacion = payload.new;
          const foundIndex = this._publicaciones.value.findIndex(x => x.id == updatedItem.id);
          if(this._publicaciones.value[foundIndex].message !== updatedItem.message ) {
            this._publicaciones.value[foundIndex].message = updatedItem.message;
            return;
          }else {
            if (updatedItem.estado == 1 && updatedItem.comentarios == 0 && updatedItem.likes == 0) {
              this._publicaciones.next([updatedItem, ...this._publicaciones.value]);
            } else {
               
                if(this._publicaciones.value[foundIndex].likes < updatedItem.likes){
                  this._publicaciones.value[foundIndex].likes +=  1;
                }else{
                  this._publicaciones.value[foundIndex].comentarios += 1;
                }
                
            }
          }
          
        }
      })
      .subscribe();
    return this.subscriptionPublicacion;
  }

  unsubscribePublicacion(): any {
    this.supabase.removeSubscription(this.subscriptionPublicacion);
  }

  listenAllAprobar(): any {
    this.subscriptionPublicacionAprobar = this.supabase
      .from('publicacion')
      .on('*', (payload) => {
        if (payload.eventType === 'DELETE') {
          // Filter out the removed item
          const oldItem: Publicacion = payload.old;
          const newValue = this._publicacionesAprobar.value.filter(
            (item) => oldItem.id !== item.id
          );
          this._publicacionesAprobar.next(newValue);
        } else if (payload.eventType === 'INSERT') {
          // Add the new item
          const newItem: Publicacion = payload.new;
          if (newItem.estado === 0) {
            this._publicacionesAprobar.next([newItem, ...this._publicacionesAprobar.value]);
          }
        } else if (payload.eventType === 'UPDATE') {
          // Update one item
          const updatedItem: Publicacion = payload.new;
          const foundIndex = this._publicaciones.value.findIndex(x => x.id == updatedItem.id);
          if(this._publicaciones.value[foundIndex].message !== updatedItem.message ) {
            this._publicaciones.value[foundIndex].message = updatedItem.message;
          }else {
            if (updatedItem.estado === 1 || updatedItem.estado === 2) {
              const newValue = this._publicacionesAprobar.value.filter(
                (item) => updatedItem.id !== item.id
              );
              this._publicacionesAprobar.next(newValue);
            }
          }
        }
      })
      .subscribe();
    return this.subscriptionPublicacionAprobar;
  }

  unsubscribePublicacionAprobar(): any {
    this.supabase.removeSubscription(this.subscriptionPublicacionAprobar);
  }
}
