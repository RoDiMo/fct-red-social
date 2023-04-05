import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comentario } from './comentario/comentario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  url:string;

  constructor(private http: HttpClient, ) { 
    this.url = 'http://localhost:8000/comentarios/'
  }

  obtenerComentarios(): Observable<any>{
    return this.http.get<any>(this.url)
  }

  nuevoComentario(comentario: any): Observable<any>{
    return this.http.post<any>(this.url, comentario)
  }
} 
