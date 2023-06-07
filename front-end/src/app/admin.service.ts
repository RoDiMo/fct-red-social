import { Injectable } from '@angular/core';
import { url } from './utils';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private urlPosts:string = url()+'posts/'
  private urlUsuarios:string = url()+'usuarios/'

  constructor(private http: HttpClient) { }

  ordenarPosts(campo:string, valorBusqueda:string, fecha_inicio:string, fecha_fin:string): Observable<any>{
   
    return this.http.get<any>(this.urlPosts+`?ordering=${campo}&search=${valorBusqueda}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`)

    // ?fecha_fin=&fecha_inicio=2023-05-19&oculto=&ordering=-titulo&usuario=1
  }


  ordenarUsuarios(campo:string, valorBusqueda:string, fecha_inicio:string, fecha_fin:string): Observable<any>{
    return this.http.get<any>(this.urlUsuarios+`?ordering=${campo}&search=${valorBusqueda}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`)
  }
}
