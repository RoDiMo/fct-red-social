import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggedInUser, UserCredentials } from "./auth";
import { PerfilUsuario } from './perfil-usuario/perfil-usuario';
import { Router } from '@angular/router';
import { url } from './utils';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionUsuariosService {
  public urlLogin:string = url()+'api-user-login/';
  public urlRegistro:string = url()+'registro/';
  public urlUsuarios:string = url()+'usuarios/';

  constructor(private http: HttpClient, private router: Router) { }

  //  --------------LOGIN--------------------

  //Recibe el token con los datos del usuario
   logIn(username: string, password: string): Observable<any> {
     return this.http.post( this.urlLogin, { username, password }) as  Observable<any>;
   }

   // Almacena al usuario en el LocalSotrage
   setLoggedInUser(userData: LoggedInUser): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
   }


   //  --------------REGISTRO--------------------
   public getUsuarios(): Observable<any> {
    return this.http.get(this.urlRegistro)
  }

  public nuevoUsuario(usuario : any): Observable<any> {
    console.log(usuario)
    return this.http.post<any>(this.urlRegistro, usuario);
  }


  public logInUser(user: any): void{
    this.logIn(user.username, user.password).subscribe({
        next: (data) => {
          this.setLoggedInUser(data);
          this.router.navigateByUrl(`/`);
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }


  // ---------------OBTENER DATOS USUARIO--------------------

  public obtenerCredenciales(){
    const userData =  localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        console.error('Error al analizar JSON: ', e);
        return null;
      }
    }
    return null;
  }

  getUsuariosAll() : Observable<any>{
    return this.http.get(this.urlUsuarios);
  }


  getUsuario(id: string|null): Observable<any> {
    return this.http.get(this.urlUsuarios+`${id}/`);
  }

  getUsuarioUrl(url: any): Observable<any> {
    return this.http.get(`${url}`);
  }

}
