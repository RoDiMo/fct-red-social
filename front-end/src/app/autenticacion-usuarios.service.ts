import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggedInUser } from "./auth";
import { PerfilUsuario } from './perfil-usuario/perfil-usuario';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionUsuariosService {

  constructor(private http: HttpClient) { }

  //  --------------LOGIN--------------------

  //Recibe el token con los datos del usuario
   logIn(username: string, password: string): Observable<any> {
     return this.http.post(
       'http://localhost:8000/api-user-login/', { username, password }
       ) as  Observable<any>;
   }

   // Almacena al usurio en el LocalSotrage
   setLoggedInUser(userData: LoggedInUser): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
   }


   //  --------------REGISTRO--------------------
   public getUsuarios(): Observable<any> {
    return this.http.get('http://localhost:8000/registro/')
  }

  public nuevoUsuario(formData : FormData): Observable<any> {

    return this.http.post<any>('http://localhost:8000/registro/', formData);
  }

}
