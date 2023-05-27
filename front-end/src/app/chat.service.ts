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

  obtenerMensajesNoLeidos(idEmisor:any, idReceptor:any ):  Observable<any>{

    return this.http.get<any>(this.url+`mensajes_no_leidos/?emisor=${idEmisor}&receptor=${idReceptor}`)
  }

  actualizarMensaje(idMensaje:string ,mensaje: any):  Observable<any>{

    return this.http.put<any>(this.url+`${idMensaje}/`, mensaje)
  }

  nuevoMensaje(mensaje:any):  Observable<any>{
    return this.http.post<any>(this.url, mensaje)
  }

}
