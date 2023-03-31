import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilUsuarioService {

  constructor(private http: HttpClient) { }

  getPerfilUsuario(id: string|null): Observable<any> {
    return this.http.get(`http://localhost:8000/usuarios/${id}/`);
  }
}
