import { HttpClient, HttpHeaders, HttpClientModule} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginaPrincipalService {
  public url:string;

  constructor(private http: HttpClient) {
    this.url = 'http://localhost:8000/posts/';
   }

   getPost(): Observable<any>{
    return this.http.get(this.url+"?ordering=fecha_publicacion")
   }

}
