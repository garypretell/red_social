import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  subscriptionPaciente: any;
  private _pacientes = new BehaviorSubject<Paciente[]>([]);
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
   get pacientes(): Observable<Paciente[]> {
    return this._pacientes.asObservable();
  }

  async loadPacientes(): Promise<any> {
    const query: any = await this.supabase.from<Paciente>('paciente').select('*');
    return this._pacientes.next(query.data);
  }

  async addPaciente(paciente: Paciente): Promise<any> {
    const { data, error } = await this.supabase
      .from<Paciente>('paciente')
      .insert(paciente);
    return { data, error };
  }

  async getPacientes(): Promise<any> {
    const { data: pacientes, error } = await this.supabase
      .from<Paciente>('paciente')
      .select('*')
      .limit(10);
    return { pacientes, error };
  }

  async dataTable(init: number, end: number): Promise<any> {
    const { data: pacientes, error } = await this.supabase
      .from<Paciente>('paciente')
      .select('*')
      .range(init, end);
    return { pacientes, error };
  }

  async patientId(id: any): Promise<any> {
    const { data, error } = await this.supabase
      .from('paciente')
      .select('*')
      .match({ id })
      .single();
    return data;
  }

  async deletePaciente(id: any): Promise<any> {
    const data = await this.supabase.from('paciente').delete().match({ id });
    return data;
  }

  async update(id: any, paciente: Paciente): Promise<any> {
    const { data, error } = await this.supabase
      .from('paciente')
      .update(paciente)
      .match({ id });
  }

  listenAll(): any {
    this.subscriptionPaciente = this.supabase
      .from('paciente')
      .on('*', (payload) => {
        if (payload.eventType === 'DELETE') {
          // Filter out the removed item
          const oldItem: Paciente = payload.old;
          const newValue = this._pacientes.value.filter(
            (item) => oldItem.id !== item.id
          );
          this._pacientes.next(newValue);
        } else if (payload.eventType === 'INSERT') {
          // Add the new item
          const newItem: Paciente = payload.new;
          this._pacientes.next([...this._pacientes.value, newItem]);
        } else if (payload.eventType === 'UPDATE') {
          // Update one item
          const updatedItem: Paciente = payload.new;
          const newValue = this._pacientes.value.map((item) => {
            if (updatedItem.id === item.id) {
              item = updatedItem;
            }
            return item;
          });
          this._pacientes.next(newValue);
        }
      })
      .subscribe();
    return this.subscriptionPaciente;
  }

  unsubscribePaciente(): any {
    this.supabase.removeSubscription(this.subscriptionPaciente);
  }
}
