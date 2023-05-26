import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from './utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObtenerDireccionService {

  public url = url()

  constructor(private http: HttpClient) { }


  obtenerPaises(): Observable<any> {
    return this.http.get(this.url+`paises/`)
  }


  obtenerEstados(pais:string): Observable<any>{
    return this.http.get(this.url+`estados/?id_pais__nombre_pais=${pais}`)
  }

  obtenerCiudades(estado:string): Observable<any>{
    return this.http.get(this.url+`ciudades/?id_estado__nombre_estado=${estado}`)
  }

}
