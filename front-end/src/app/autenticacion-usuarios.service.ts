import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggedInUser, UserCredentials } from "./auth";
import { PerfilUsuario } from './perfil-usuario/perfil-usuario';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionUsuariosService {

  constructor(private http: HttpClient, private router: Router) { }

  //  --------------LOGIN--------------------

  //Recibe el token con los datos del usuario
   logIn(username: string, password: string): Observable<any> {
     return this.http.post(
       'http://localhost:8000/api-user-login/', { username, password }
       ) as  Observable<any>;
   }

   // Almacena al usuario en el LocalSotrage
   setLoggedInUser(userData: LoggedInUser): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
   }


   //  --------------REGISTRO--------------------
   public getUsuarios(): Observable<any> {
    return this.http.get('http://localhost:8000/registro/')
  }

  public nuevoUsuario(usuario : PerfilUsuario): Observable<any> {
    return this.http.post<any>('http://localhost:8000/registro/', usuario);
  }


  public logInUser(user: UserCredentials): void{
    this.logIn(user.username, user.password).subscribe({
        next: (data) => {
          this.setLoggedInUser(data);
          this.router.navigateByUrl(`/perfil-personal/${data.id}`);
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }


  // ---------------OBTENER DATOS USUARIO--------------------

  public obtenerCredenciales(){
    return JSON.parse(localStorage.getItem('userData')!);
  }

}
