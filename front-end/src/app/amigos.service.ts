import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmigosService {
  private url: string = "http://localhost:8000/amigos/"

  constructor(private http: HttpClient) { }

  obtenerAmistad(idUS: string, idUR: string): Observable<any>{
    //console.log(this.url+`?usuario_solicitante=${idUS}&usuario_receptor=${idUR}`)
    return this.http.get<any>(this.url+`?usuario_solicitante=${idUS}&usuario_receptor=${idUR}`)
  }


  nuevaAmistad(amigo: any): Observable<any>{
    return this.http.post(this.url, amigo)
  }

  eliminarAmigo(url: string): Observable<any>{
    return this.http.delete<any>(url)
  }


}
