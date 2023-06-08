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

  // Obtenemos el usuario por su id
  getPerfilUsuario(id: string|null): Observable<any> {
    return this.http.get(this.url+`${id}/`);
  }

  // Obtenemos el usuario por su url
  getUsuario(url: any): Observable<any> {
    return this.http.get(`${url}`);
  }

  
  editarDatosPerfil(id:string, usuario:any) : Observable<any>{
    return this.http.put<any>(this.url+`${id}/`, usuario, { observe: 'response' })
  }

  //Obtenemos los datos de los usuario que están chateando
  obtenerParejaChat(idEmisor:any, idReceptor:any): Observable<any>{
    return this.http.get<any>(this.url+`obtener_pareja_usuarios/?id=${idEmisor}&id=${idReceptor}`)
  }
}
