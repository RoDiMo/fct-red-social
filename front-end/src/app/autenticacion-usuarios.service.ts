import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoggedInUser } from "./auth";

@Injectable({
  providedIn: 'root'
})
export class AutenticacionUsuariosService {

  constructor(private http: HttpClient) { }

  //Recibe el token con los datos del usuario
   logIn(username: string, password: string): Observable<any> {
     return this.http.post(
       'http://localhost:8000/api-user-login/', { username, password }
       ) as  Observable<any>;
   }


   setLoggedInUser(userData: LoggedInUser): void {
    if (localStorage.getItem('userData') !== JSON.stringify(userData)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
   }

}
