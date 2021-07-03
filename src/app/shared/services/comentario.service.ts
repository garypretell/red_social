import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comentario } from '../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  query: any;
  subscriptionComentario: any;
  private _comentarios = new BehaviorSubject<any[]>([]);
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

    this.listenAll();
  }

  getComentario(comments: any): Comentario[] {
    let all: Comentario[] = [];
    all = comments;
    let map = new Map;
    let result: Comentario[] = [];
    let c: Comentario
    for (c of all) {
      if (c.parentId == 0) {
        result.push(c);
      }
      map.set(c.id, c);
    }
    let d: Comentario
    for (d of all) {
      if (d.parentId != 0) {
        let parent: Comentario = map.get(d.parentId);
        if (parent.child == null) {
          parent.child = [];
        }
        parent?.child?.push(d);
      }
    }
    return result;
  }

  get comentarios(): Observable<Comentario[]> {
    return this._comentarios.asObservable();
  }

  async loadComentarios(id: any): Promise<any> {
    this.query = await this.supabase.from<Comentario>('comentario').select('*')
    .match({ publicacionId: id });
    return this._comentarios.next(this.getComentario(this.query.data));
  }

  async addComentario(comentario: Comentario): Promise<any> {
    const { data, error } = await this.supabase
      .from<Comentario>('comentario')
      .insert(comentario);
    return { data, error };
  }

  async findComentario(comentario: Comentario): Promise<any> {
    const { data, error } = await this.supabase
      .from<Comentario>('comentario')
      .select()
      .limit(1)
      .match({ publicacionId: comentario.publicacionId, parentId: 0 })
      
    return { data, error };
  }

  async getComentarios(): Promise<any> {
    const { data: pacientes, error } = await this.supabase
      .from<Comentario>('comentario')
      .select('*')
      .limit(10);
    return { pacientes, error };
  }

  async dataTable(init: number, end: number): Promise<any> {
    const { data: pacientes, error } = await this.supabase
      .from<Comentario>('comentario')
      .select('*')
      .range(init, end);
    return { pacientes, error };
  }

  async comentarioId(id: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('comentario')
      .select('*')
      .match({ id })
      .single();
    return data;
  }

  async deletePaciente(id: any): Promise<any> {
    const data = await this.supabase.from('comentario').delete().match({ id });
    return data;
  }

  async update(id: any, comentario: Comentario): Promise<any> {
    const { data, error } = await this.supabase
      .from('comentario')
      .update(comentario)
      .match({ id });
  }

  listenAll(): any {
    this.subscriptionComentario = this.supabase
      .from('comentario')
      .on('*', (payload) => {
        if (payload.eventType === 'DELETE') {
          // Filter out the removed item
          const oldItem: Comentario = payload.old;
          const newValue = this._comentarios.value.filter(
            (item) => oldItem.id !== item.id
          );
          this._comentarios.next(newValue);
        } else if (payload.eventType === 'INSERT') {
          const newItem: Comentario = payload.new;
          const findItemNested = (arr: any, itemId: any, nestingKey: any) => (
            arr.reduce((a: any, item: any) => {
              if (a) {
                a.child = [newItem];
                return this._comentarios.value;
              }
              if (item.id === itemId) {
                if (item.child) {
                  item.child.push(newItem);
                } else {
                  item.child = [newItem]
                }
                return this._comentarios.value;
              };
              if (item[nestingKey]) return findItemNested(item[nestingKey], itemId, nestingKey)
            }, null)
          );

          const res = findItemNested(this._comentarios.value, newItem.parentId, "child");

        } else if (payload.eventType === 'UPDATE') {
          // Update one item
          const updatedItem: Comentario = payload.new;
          const newValue = this._comentarios.value.map((item) => {
            if (updatedItem.id === item.id) {
              item = updatedItem;
            }
            return item;
          });
          this._comentarios.next(newValue);
        }
      })
      .subscribe();
    return this.subscriptionComentario;
  }

  unsubscribePaciente(): any {
    this.supabase.removeSubscription(this.subscriptionComentario);
  }
}