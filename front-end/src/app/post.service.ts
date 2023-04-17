import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from './post/post';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url:string; 

  constructor(private http: HttpClient) { 
      this.url ='http://localhost:8000/posts/'
  }


  //Obtiene el post por su id
  obtenerPost(id: string|null): Observable<any>{
    return this.http.get<any>(this.url+`${id}/`)
  }

  obtenerPostUrl(url:string){
    return this.http.get<any>(url)
  }

  nuevoPost(post: any): Observable<any>{
    //console.log(post)
    return this.http.post<any>(this.url, post)
  }

  
  modificarPost(id:string ,post: any): Observable<any>{
    console.log(post)
    return this.http.put<any>(this.url+`${id}/`, post)
  }


  modificarPostUrl(url:string ,post: any): Observable<any>{
    console.log(post)
    return this.http.put<any>(url, post)
  }

  eliminarPost(id: string|null): Observable<any>{
    return this.http.delete<any>(this.url+`${id}/`)
  }

}
