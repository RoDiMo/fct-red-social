import { Injectable } from '@angular/core';
import { url } from './utils';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private url:string = url()+'posts/'

  constructor(private http: HttpClient) { }

  ordenarPosts(campo:string, valorBusqueda:string): Observable<any>{
    console.log(this.url+`?ordering=${campo}&search=${valorBusqueda}`)
    return this.http.get<any>(this.url+`?ordering=${campo}&search=${valorBusqueda}`)
  }
}
