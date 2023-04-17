import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Likes } from './home/home';

@Injectable({
  providedIn: 'root'
})
export class GestionLikesService {

  url:string;
  constructor(private http:HttpClient) {
    this.url = 'http://localhost:8000/likes/'
   }


  // Obtiene los comentarios pertenecientes a un post
  obtenerPosts(id:any): Observable<any>{
    return this.http.get<any>(this.url+`?post=${id}`)
  }

  guardarLike(like: Likes){
    return this.http.post<any>(this.url, like)
  }

  eliminarLike(like: any){
    return this.http.delete<any>(like)
  }

  actualizarLikesPost(post: any){
    return this.http.post<any>(this.url, post)
  }

}
