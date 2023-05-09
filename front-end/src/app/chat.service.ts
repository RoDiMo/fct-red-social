import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from './utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private url:string; 

  constructor(private http: HttpClient) { 
      this.url = url()+'chat/'
     
  }


  obtenerMensajesChat(idEmisor:any, idReceptor:any ): Observable<any>{ 
    return this.http.get<any>(this.url+`mensajes_chat/?emisor=${idEmisor}&receptor=${idReceptor}`)
  }

  nuevoMensaje(mensaje:any):  Observable<any>{
    return this.http.post<any>(this.url, mensaje)
  }

}
