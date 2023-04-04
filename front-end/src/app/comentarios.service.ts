import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comentario } from './comentario/comentario';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  url:string;

  constructor(private http: HttpClient, ) { 
    this.url = 'http://localhost:8000/comentarios/'
  }


  nuevoComentario(comentario: Comentario){
    return this.http.post<any>(this.url, comentario)
  }
} 
