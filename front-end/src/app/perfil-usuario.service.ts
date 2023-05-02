import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { url } from './utils';

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {
  private url: string = url()+'usuarios/'
  constructor(private http: HttpClient) {  }

  getPerfilUsuario(id: string|null): Observable<any> {
    return this.http.get(this.url+`${id}/`);
  }


  getUsuario(url: any): Observable<any> {
    return this.http.get(`${url}`);
  }
}
