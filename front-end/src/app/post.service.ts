import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from './post/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private url:string; 

  constructor(private http: HttpClient, private router: Router) { 
      this.url ='http://localhost:8000/posts/'
  }



  nuevoPost(post: Post){
    return this.http.post<any>(this.url, post)
  }
}
