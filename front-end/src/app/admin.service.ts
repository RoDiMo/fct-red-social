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

  ordenarPosts(campo:string, valorBusqueda:string): Observable<any>{
    console.log(this.urlPosts+`?ordering=${campo}&search=${valorBusqueda}`)
    return this.http.get<any>(this.urlPosts+`?ordering=${campo}&search=${valorBusqueda}`)
  }


  ordenarUsuarios(campo:string, valorBusqueda:string): Observable<any>{
    return this.http.get<any>(this.urlUsuarios+`?ordering=${campo}&search=${valorBusqueda}`)
  }
}
