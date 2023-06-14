import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { url } from './utils';

@Injectable({
  providedIn: 'root'
})
export class AmigosService {
  public urlAmistades: string = url()+"amigos/"
  public urlCancelaciones: string = url()+"amistadescanceladas/"
  public urlUsuarios : string = url() + "usuarios/"

  constructor(private http: HttpClient) { }

  // -------- GESTION DE AMISTADES --------

  obtenerAmigos(): Observable<any>{
    return this.http.get<any>(this.urlUsuarios+`obtener_amigos/`)
  }

  noAmigos(): Observable<any>{
    return this.http.get<any>(this.urlUsuarios+`no_amigos/`)
  }



  obtenerAmistad(idUS: string, idUR: string): Observable<any>{
    //console.log(this.url+`?usuario_solicitante=${idUS}&usuario_receptor=${idUR}`)
    return this.http.get<any>(this.urlAmistades+`?usuario_solicitante=${idUS}&usuario_receptor=${idUR}`)
  }

  obtenerAmistades(idUS: string): Observable<any>{
    return this.http.get<any>(this.urlAmistades+`?ordering=-fecha_publicacion&usuario_solicitante=${idUS}&usuario_receptor=`)
  }


  nuevaAmistad(amigo: any): Observable<any>{
    return this.http.post(this.urlAmistades, amigo)
  }

  eliminarAmigo(url: string): Observable<any>{
    return this.http.delete<any>(url,{observe:  'response'})
  }

  // -------- GESTIÓN DE CANCELACION DE AMISTADES

  nuevaCancelacion(amistadCancelada: any): Observable<any>{
    //console.log(amistadCancelada)
    return this.http.post(this.urlCancelaciones, amistadCancelada)
  }


}
