  
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileInfo } from '../models/fileInfo.model';
import { FileItem } from '../models/fileItem.model';
import { Upload } from '../models/upload.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  subscriptionImagen: any;
  private _imagenes = new BehaviorSubject<Upload[]>([]);
  public supabaseClient: SupabaseClient;

  constructor(private sanitizer: DomSanitizer) {
    this.supabaseClient = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
      {
        autoRefreshToken: true,
        persistSession: true,
      }
    );

    
  }

  get imagenes(): Observable<Upload[]> {
    return this._imagenes.asObservable();
  }

  async loadImagenes(): Promise<any> {
    const query: any = await this.supabaseClient
      .from<Upload>('upload')
      .select('*')
      .limit(12);
    return this._imagenes.next(query.data);
  }

  async dataTable(init: number, end: number): Promise<any> {
    const { data, error } = await this.supabaseClient
      .from<Upload>('upload')
      .select('*')
      .range(init, end);
    if (error) console.error(error)
    else {
      if (data!.length > 0) {
        this._imagenes.next([...this._imagenes.value, ...data! ]);
      }
    }
    return { data, error };
  }

  async uploadFile(user: any, file: File): Promise<any> {
    const time = new Date().getTime();
    const fileName = `${user}_${time}.jpg`;
 
    // Upload the file to Supabase
    const { data, error } = await this.supabaseClient
      .storage
      .from(`avatars`)
      .upload(fileName, file);
    return this.saveFileInfo(fileName);
  }

  getImageForFile(item: any) {
    const temp = this.supabaseClient.storage.from(`avatars`).getPublicUrl(`1624416886234.jpg`);
    console.log(temp);
    return temp;
  }
 
  // Create a record in our DB
  async saveFileInfo(fileName: any): Promise<any> {
    const temp =this.supabaseClient.storage.from(`avatars`).getPublicUrl(fileName);
    const image_url = temp.publicURL;
    const newFile = {
      private: false,
      file_name: fileName,
      image_url
    };

    return this.supabaseClient.from('upload').insert(newFile);
  }
 
  async upload(bucket: string, path: string, file: File) {
    const { data, error } = await this.supabaseClient.storage
      .from(bucket)
      .upload(path, file);

    return { data, error };
  }
  
  async download(bucket: string, path: string) {
    const { data, error } = await this.supabaseClient.storage
      .from(bucket)
      .download(path);

    return { data, error };
  }

  listenAll(): any {
    this.subscriptionImagen = this.supabaseClient
      .from('upload')
      .on('*', (payload) => {
        if (payload.eventType === 'DELETE') {
          // Filter out the removed item
          const oldItem: Upload = payload.old;
          const newValue = this._imagenes.value.filter(
            (item) => oldItem.id !== item.id
          );
          this._imagenes.next(newValue);
        } else if (payload.eventType === 'INSERT') {
          // Add the new item
          const newItem: Upload = payload.new;
            this._imagenes.next([newItem, ...this._imagenes.value]);
        } else if (payload.eventType === 'UPDATE') {
          // Update one item
          const updatedItem: Upload = payload.new;
            this._imagenes.next([updatedItem, ...this._imagenes.value]);
        }
      })
      .subscribe();
    return this.subscriptionImagen;
  }

  unsubscribeImagen(): any {
    this.supabaseClient.removeSubscription(this.subscriptionImagen);
  }

}