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

  // Obtiene todos los comentarios
  obtenerComentarios(): Observable<any>{
    return this.http.get<any>(this.url)
  }


  obtenerComentario(id:any): Observable<any>{
    return this.http.get<any>(this.url+`${id}/`)
  }


  // Obtiene los comentarios pertenecientes a un post
  obtenerComentariosPost(id:any): Observable<any>{
    return this.http.get<any>(this.url+`?post=${id}`)
  }


  // Crea un nuevo comentario
  nuevoComentario(comentario: any): Observable<any>{
    return this.http.post<any>(this.url, comentario)
  }


  editarComentario(id:string, comentario:any){
    return this.http.put<any>(this.url+`${id}/`, comentario)
  }

  // Elimina un comentario
  eliminarComentario(id:string): Observable<any>{
    console.log("eliminar comentario", this.url+`${id}/`)
    return this.http.delete<any>(this.url+`${id}/`)
  }

} 
