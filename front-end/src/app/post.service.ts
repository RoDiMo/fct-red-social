import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from './post/post';
import { Observable } from 'rxjs';
import { url } from './utils';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  public url:string; 

  constructor(private http: HttpClient) { 
      this.url = url()+'posts/'
 
  }


  //Obtiene el post por su id
  obtenerPost(id: string|null): Observable<any>{
    return this.http.get<any>(this.url+`${id}/`)
  }

  obtenerPostUrl(url:string){
    return this.http.get<any>(url)
  }

  obtenerPostsUsuario(id: string): Observable<any>{
    return this.http.get<any>(this.url+`?usuario=${id}`)
  }

  nuevoPost(post: any): Observable<any>{
    return this.http.post<any>(this.url, post,  { observe: 'response' })
  }

  
  modificarPost(id:string ,post: any): Observable<any>{
    return this.http.put<any>(this.url+`${id}/`, post, { observe: 'response' })
  }


  modificarPostUrl(url:string ,post: any): Observable<any>{
    return this.http.put<any>(url, post)
  }

  eliminarPost(id: string|null): Observable<any>{
    return this.http.delete<any>(this.url+`${id}/`)
  }

}
